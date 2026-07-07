import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmRidePopup = ({
  confirmRidePopupOpen,
  setConfirmRidePopupOpen,
  setRidePopupOpen,
  ride,
}) => {
  const fullScreenRef = useRef(null);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (confirmRidePopupOpen) {
      gsap.to(fullScreenRef.current, {
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    } else {
      gsap.to(fullScreenRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power3.in",
      });

      setErrorMessage("");
      setLoading(false);
      setOtp("");
    }
  }, [confirmRidePopupOpen]);

  const handleCancel = () => {
    if (loading) return;

    setConfirmRidePopupOpen(false);

    if (setRidePopupOpen) {
      setRidePopupOpen(true);
    }
  };

  const handleStartRide = async () => {
    if (!ride?._id || loading) return;

    if (!otp.trim()) {
      setErrorMessage("Please enter the ride OTP.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
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
          ride: response.data,
        },
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Invalid OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={fullScreenRef}
      className="absolute inset-0 z-50 flex h-screen w-full translate-y-full flex-col justify-end bg-slate-900"
    >
      <div className="h-[92vh] w-full rounded-t-[2.5rem] bg-white px-5 py-6 shadow-[0_-15px_40px_rgba(0,0,0,0.2)]">

        {/* Header */}

        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-5">
          <h2 className="text-3xl font-black text-slate-900">
            Trip Details
          </h2>

          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <i className="ri-close-line text-3xl"></i>
          </button>
        </div>

        {/* Passenger */}

        <div className="mb-5 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                alt="Passenger"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold capitalize">
                {ride?.user?.fullname?.firstname}{" "}
                {ride?.user?.fullname?.lastname}
              </h3>

              <p className="text-lg font-semibold text-emerald-600">
                User
              </p>
            </div>
          </div>
        </div>

        {/* Ride Details */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex gap-4">

            <div className="flex flex-col items-center">
              <i className="ri-map-pin-user-fill text-3xl text-blue-500"></i>
              <div className="my-2 h-14 w-[2px] bg-slate-200"></div>
              <i className="ri-map-pin-2-fill text-3xl text-red-500"></i>
            </div>

            <div className="flex-1">

              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
                  Pickup Location
                </p>

                <h4 className="mt-1 text-xl font-bold">
                  {ride?.pickup}
                </h4>
              </div>

              <div className="my-5 border-b border-slate-200"></div>

              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
                  Drop-off Location
                </p>

                <h4 className="mt-1 text-xl font-bold">
                  {ride?.destination}
                </h4>
              </div>

            </div>

          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">

            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
                Payment Method
              </p>

              <h4 className="text-xl font-bold capitalize">
                {ride?.paymentMethod}
              </h4>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
                Fare
              </p>

              <h3 className="text-4xl font-black text-emerald-600">
                ₹{ride?.fare}
              </h3>
            </div>

          </div>

        </div>

        {/* OTP Card */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="mb-4 text-xl font-medium text-slate-500">
            Ride OTP
          </p>

          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            placeholder="Enter 6 digit OTP"
            className="h-16 w-full rounded-2xl border border-slate-300 px-6 text-center text-2xl font-bold tracking-[0.35em] outline-none transition focus:border-black"
          />

          <p className="mt-5 text-lg leading-7 text-slate-500">
            Ask the passenger for the OTP before starting the ride.
          </p>

        </div>

        {errorMessage && (
          <p className="mt-3 text-center font-semibold text-red-500">
            {errorMessage}
          </p>
        )}

        {/* Buttons */}

        <div className="mt-6 flex gap-4">

          <button
            onClick={handleCancel}
            disabled={loading}
            className="h-16 flex-1 rounded-3xl bg-slate-100 text-xl font-bold"
          >
            Cancel
          </button>

          <button
            onClick={handleStartRide}
            disabled={loading}
            className="h-16 flex-1 rounded-3xl bg-black text-xl font-bold text-white"
          >
            {loading
              ? "Verifying..."
              : "Verify OTP & Start Ride"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default ConfirmRidePopup;