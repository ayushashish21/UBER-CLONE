import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const ConfirmRidePopup = ({
  ride,
  confirmRidePopupOpen,
  setConfirmRidePopupOpen,
  setRidePopupOpen,
}) => {
  const popupRef = useRef(null);
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (confirmRidePopupOpen) {
      gsap.to(popupRef.current, {
        y: 0,
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      gsap.to(popupRef.current, {
        y: "100%",
        duration: 0.4,
        ease: "power3.in",
      });

      setOtp("");
      setErrorMessage("");
      setLoading(false);
    }
  }, [confirmRidePopupOpen]);

  const handleCancel = () => {
    if (loading) return;

    setConfirmRidePopupOpen(false);
    setRidePopupOpen(true);
  };

  const handleStartRide = async () => {
    if (!otp.trim()) {
      setErrorMessage("Please enter OTP.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/start`,
        {
          rideId: ride._id,
          otp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/captain-riding", {
        state: {
          ride: res.data,
        },
      });
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error || "Invalid OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={popupRef}
      className="fixed bottom-0 left-0 z-50 w-full translate-y-full rounded-t-3xl bg-white px-5 py-6 pt-12 shadow-[0_-10px_40px_rgba(0,0,0,0.15)]"
    >
      {/* Drag Handle */}

      <div className="absolute left-1/2 top-4 h-1.5 w-12 -translate-x-1/2 rounded-full bg-slate-200"></div>

      {/* Header */}

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">
          Trip Details
        </h2>

        <button
          onClick={handleCancel}
          disabled={loading}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>
      </div>

      {/* Passenger */}

      <div className="mb-5 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
            alt=""
            className="h-12 w-12 rounded-full object-cover"
          />

          <div>
            <h3 className="text-lg font-bold capitalize">
              {ride?.user?.fullname?.firstname}{" "}
              {ride?.user?.fullname?.lastname}
            </h3>

            <p className="text-sm font-semibold text-emerald-600">
              User
            </p>
          </div>
        </div>
      </div>

      {/* Ride */}

      <div className="relative mb-6 space-y-5 pl-6 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-0.5 before:bg-slate-200">
        <div className="relative">
          <i className="ri-record-circle-fill absolute -left-6 top-0.5 text-xs text-blue-600 bg-white"></i>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Pickup
          </p>

          <p className="mt-1 text-sm font-bold leading-tight text-slate-900 break-words">
            {ride?.pickup}
          </p>
        </div>

        <div className="relative">
          <i className="ri-map-pin-fill absolute -left-[26px] top-0 text-base text-red-500 bg-white"></i>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Drop-off
          </p>

          <p className="mt-1 text-sm font-bold leading-tight text-slate-900 break-words">
            {ride?.destination}
          </p>
        </div>
      </div>

      {/* Fare */}

      <div className="mb-5 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Payment
          </p>

          <h4 className="text-lg font-bold capitalize">
            {ride?.paymentMethod}
          </h4>
        </div>

        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Fare
          </p>

          <h3 className="text-3xl font-black text-emerald-600">
            ₹{ride?.fare}
          </h3>
        </div>
      </div>

      {/* OTP */}

      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold text-slate-500">
          Ride OTP
        </label>

        <input
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, ""))
          }
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          className="h-14 w-full rounded-2xl border border-slate-300 text-center text-xl font-bold tracking-[0.3em] outline-none focus:border-black"
        />

        <p className="mt-2 text-xs text-slate-500">
          Ask the passenger for the OTP before starting the ride.
        </p>
      </div>

      {errorMessage && (
        <p className="mb-4 text-center text-sm font-semibold text-red-500">
          {errorMessage}
        </p>
      )}

      {/* Buttons */}

      <div className="flex gap-4">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="flex-1 rounded-2xl bg-slate-100 py-3.5 font-bold text-slate-700"
        >
          Back
        </button>

        <button
          onClick={handleStartRide}
          disabled={loading}
          className="flex-[2] rounded-2xl bg-black py-3.5 font-bold text-white"
        >
          {loading ? "Verifying..." : "Start Ride"}
        </button>
      </div>
    </div>
  );
};

export default ConfirmRidePopup;