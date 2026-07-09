const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "captain",
    },

    pickup: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    vehicleType: {
      type: String,
      enum: ["car", "auto", "motorcycle"],
      required: true,
    },

    fare: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "ongoing",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    duration: Number,

    distance: Number,

    paymentMethod: {
      type: String,
      enum: ["online", "cash"],
      default: "online",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    paymentID: String,

    orderId: String,

    signature: String,

    otp: {
      type: String,
      required: true,
      select: false,
    },

    /*
    ==========================
    Ride Timeline
    ==========================
    */

    acceptedAt: Date,

    startedAt: Date,

    completedAt: Date,

    paidAt: Date,

    repeatCount: {
      type: Number,
      default: 0,
    },

    repeatedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ride",
      default: null,
    },

  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ride", rideSchema);