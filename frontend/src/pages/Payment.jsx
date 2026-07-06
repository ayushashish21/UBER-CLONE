import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import 'remixicon/fonts/remixicon.css';

// Dynamically loads the Razorpay Checkout script once, reused across mounts.
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { ride } = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [paid, setPaid] = useState(ride?.paymentStatus === "paid");
  const [errorMessage, setErrorMessage] = useState("");
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    loadRazorpayScript().then(setScriptReady);
  }, []);

  useEffect(() => {
    if (!ride) {
      navigate("/home", { replace: true });
    }
  }, [ride, navigate]);

  if (!ride) {
    return null;
  }

  const captainName = `${ride?.captain?.fullname?.firstname || ""} ${ride?.captain?.fullname?.lastname || ""}`.trim();

  /*
  Flow per the diagram:
  1. Frontend requests an order from Backend  -> POST /payments/create-order
  2. Backend creates Razorpay Order            -> returns order_id
  3. Frontend opens Razorpay Checkout          -> window.Razorpay(...).open()
  4. User pays
  5. Backend verifies signature                -> POST /payments/verify
  6. Ride status -> paymentStatus = "paid"     -> returned ride reflects this
  7. Payment success screen                    -> setPaid(true)
  */
  const handleMakePayment = async () => {
    if (isProcessing || paid) return;

    if (!scriptReady) {
      setErrorMessage("Payment gateway is still loading. Please try again in a moment.");
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage("");

      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Step 1 & 2: request order from backend, which creates it via Razorpay
      const { data: order } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/payments/create-order`,
        { rideId: ride._id },
        { headers }
      );

      // Step 3: open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Uber5",
        description: `Ride payment - ${ride.pickup} to ${ride.destination}`,
        order_id: order.orderId,
        prefill: {
          name: ride?.user?.fullname
            ? `${ride.user.fullname.firstname} ${ride.user.fullname.lastname}`
            : "",
          email: ride?.user?.email || "",
        },
        theme: {
          color: "#000000",
        },
        // Step 4 & 5: after the user pays, Razorpay calls this with the
        // payment_id/order_id/signature — send those to the backend to verify
        handler: async (response) => {
          try {
            const { data: verifiedRide } = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/payments/verify`,
              {
                rideId: ride._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers }
            );

            // Step 6 & 7: backend confirms paymentStatus = "paid"
            if (verifiedRide.paymentStatus === "paid") {
              setPaid(true);
            } else {
              setErrorMessage("Payment could not be verified. Please contact support.");
            }
          } catch (verifyError) {
            console.error(verifyError);
            setErrorMessage(
              verifyError.response?.data?.error || "Payment verification failed."
            );
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", (response) => {
        console.error("[RAZORPAY_PAYMENT_FAILED]", response.error);
        setErrorMessage(response.error?.description || "Payment failed. Please try again.");
        setIsProcessing(false);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.error || "Could not start payment. Please try again."
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex items-center gap-4 px-5 py-5 bg-white border-b border-slate-100">
        <button
          onClick={() => navigate(-1)}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition-all"
          aria-label="Go back"
        >
          <i className="ri-arrow-left-line text-xl" />
        </button>
        <h2 className="text-xl font-black text-slate-900">
          {paid ? "Payment Confirmed" : "Confirm Payment"}
        </h2>
      </div>

      <div className="flex-1 px-5 py-6 max-w-md w-full mx-auto">

        {paid && (
          <div className="mb-6 flex flex-col items-center text-center py-6">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <i className="ri-check-line text-4xl text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Payment successful</h3>
            <p className="text-sm text-slate-500 mt-1">Thanks for riding with Uber5.</p>
          </div>
        )}

        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 mb-5">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-white text-lg font-bold uppercase">
              {ride?.captain?.fullname?.firstname?.[0] || "C"}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 capitalize leading-tight">
                {captainName || "Your Captain"}
              </h4>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                {ride?.captain?.vehicle?.vehicleType || "Ride"}
              </p>
            </div>
          </div>

          <div className="space-y-4 py-4 relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            <div className="relative">
              <i className="ri-record-circle-fill absolute -left-6 top-0.5 text-xs text-slate-900 bg-white z-10" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pickup</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5 break-words">{ride?.pickup}</p>
            </div>
            <div className="relative">
              <i className="ri-map-pin-fill absolute -left-[26px] top-0.5 text-base text-red-500 bg-white z-10" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drop-off</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5 break-words">{ride?.destination}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Method</p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">Razorpay</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Fare</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">₹{ride?.fare ?? 0}</p>
            </div>
          </div>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm font-semibold text-center mb-4">{errorMessage}</p>
        )}

        {!paid ? (
          <button
            onClick={handleMakePayment}
            disabled={isProcessing || !scriptReady}
            className="w-full py-4 rounded-2xl bg-black text-white font-bold text-sm hover:bg-slate-800 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <i className="ri-bank-card-line text-lg" />
            {isProcessing
              ? "Processing..."
              : !scriptReady
              ? "Loading payment gateway..."
              : `Pay ₹${ride?.fare ?? 0}`}
          </button>
        ) : (
          <button
            onClick={() => navigate("/home")}
            className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 active:scale-[0.99] transition-all shadow-md"
          >
            Back to Home
          </button>
        )}
      </div>
    </div>
  );
};

export default Payment;