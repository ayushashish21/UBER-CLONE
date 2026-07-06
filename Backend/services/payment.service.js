const Razorpay = require("razorpay");
const crypto = require("crypto");
const rideModel = require("../models/ride.model");

const getRazorpayInstance = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        throw new Error("Razorpay API keys are missing in backend .env file");
    }

    return new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });
};

// FIX: Razorpay's Node SDK throws error objects shaped like
// { statusCode, error: { code, description, ... } } — NOT a normal
// Error with a `.message` property. The old code let these bubble up
// as-is, so err.message printed as `undefined` in the controller's
// console.error, hiding the real reason (bad/mismatched keys, invalid
// amount, etc). This helper normalizes any thrown value into a real
// Error with a readable message so failures are actually diagnosable.
const normalizeRazorpayError = (err) => {
    if (err?.error?.description) {
        return new Error(`Razorpay error: ${err.error.description}`);
    }
    if (err?.message) {
        return err;
    }
    return new Error("Unknown Razorpay error occurred.");
};

/*
=========================================
CREATE ORDER
=========================================
Called when the user clicks "Make Payment". Creates a Razorpay order tied
to the ride's fare and stores the orderId on the ride document so it can be
cross-checked during verification.
*/
module.exports.createOrder = async ({ rideId, user }) => {
    if (!rideId || !user) {
        throw new Error("Ride ID and user are required.");
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        user: user._id,
        status: "completed",
    });

    if (!ride) {
        throw new Error("Ride not found, not yours, or not yet completed.");
    }

    if (ride.paymentStatus === "paid") {
        throw new Error("This ride has already been paid for.");
    }

    const razorpay = getRazorpayInstance();

    // Razorpay expects amount in the smallest currency unit (paise for INR)
    const amountInPaise = Math.round(ride.fare * 100);

    let order;
    try {
        order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `ride_${ride._id}`,
            notes: {
                rideId: String(ride._id),
                userId: String(user._id),
            },
        });
    } catch (err) {
        // Surface Razorpay's actual error instead of an opaque "undefined"
        throw normalizeRazorpayError(err);
    }

    ride.orderId = order.id;
    await ride.save();

    return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        rideId: ride._id,
        fare: ride.fare,
    };
};

/*
=========================================
VERIFY PAYMENT SIGNATURE
=========================================
Razorpay Checkout returns razorpay_order_id, razorpay_payment_id, and
razorpay_signature after a successful payment. The signature is an
HMAC-SHA256 hash of `${order_id}|${payment_id}` signed with the key secret.
Recomputing it server-side and comparing is the only trustworthy way to
confirm the payment actually happened — the frontend callback firing is not
proof by itself, since it could be spoofed.
*/
module.exports.verifyPayment = async ({
    rideId,
    user,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
}) => {
    if (
        !rideId ||
        !user ||
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
    ) {
        throw new Error("Missing required payment verification fields.");
    }

    const ride = await rideModel
        .findOne({
            _id: rideId,
            user: user._id,
            status: "completed",
        })
        .populate("user")
        .populate("captain");

    if (!ride) {
        throw new Error("Ride not found, not yours, or not yet completed.");
    }

    if (ride.paymentStatus === "paid") {
        return ride;
    }

    if (ride.orderId !== razorpay_order_id) {
        throw new Error("Order ID mismatch. Possible tampering detected.");
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
        throw new Error("Razorpay API keys are missing in backend .env file");
    }

    const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        throw new Error("Payment signature verification failed.");
    }

    ride.paymentID = razorpay_payment_id;
    ride.signature = razorpay_signature;
    ride.paymentStatus = "paid";

    await ride.save();

    return ride;
};