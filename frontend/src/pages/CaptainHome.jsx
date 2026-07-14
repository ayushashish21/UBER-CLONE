import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";

import CaptainDetails from "../components/CaptainDetails";
import RidePopup from "../components/RidePopup";
import ConfirmRidePopup from "../components/ConfirmRidePopup";
import LiveTracking from "../components/LiveTracking";
import { getCaptainDashboard } from "../services/dashboardService";
import { SocketContext } from "../context/SocketContext";
import { useCaptainContext } from "../context/CaptainContext";

const CaptainHome = () => {
  const [ridePopupOpen, setRidePopupOpen] = useState(false);
  const [confirmRidePopupOpen, setConfirmRidePopupOpen] = useState(false);
  const [rideData, setRideData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const {
    connect,
    sendMessage,
    receiveMessage,
    isConnected,
  } = useContext(SocketContext);

  const { captain } = useCaptainContext();

  // Connect socket once
  useEffect(() => {
    connect();
  }, [connect]);

  // FIX: same join-timing race as Home.jsx. Previously this ran only when
  // `captain` changed, so if the socket handshake was still in flight when
  // `captain._id` first became available, sendMessage() would silently no-op
  // (socket not connected yet) and the captain's room join was lost for the
  // rest of the session -> new-ride events would never reach this captain.
  // The `isConnected` dependency guarantees the join is (re)sent the moment
  // the socket is actually ready, even if captain data arrived first.
  useEffect(() => {
    if (!isConnected) return;
    if (!captain?._id) return;

    console.log("[SOCKET] Joining captain room...");

    sendMessage("join", {
      userId: captain._id,
      userType: "captain",
    });
  }, [isConnected, captain, sendMessage]);

  // Live GPS Tracking
  useEffect(() => {
    if (!captain?._id) return;
    if (!isConnected) return;

    if (!navigator.geolocation) {
      console.error("Geolocation not supported.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCurrentLocation({
          lat,
          lng,
        });

        sendMessage("updateLocationCaptain", {
          userId: captain._id,
          location: {
            ltd: lat,
            lng,
          },
        });

        console.log(
          `[GPS] Updated -> Latitude: ${lat}, Longitude: ${lng}`
        );
      },
      (error) => {
        console.error("[GPS ERROR]", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    }
  }, [captain, isConnected, sendMessage]);

  // Listen for ride requests
  useEffect(() => {
    const cleanup = receiveMessage("new-ride", (ride) => {
      console.log("[SOCKET] New Ride Received", ride);

      setRideData(ride);
      setRidePopupOpen(true);
    });

    return cleanup;
  }, [receiveMessage]);

  useEffect(() => {

    const cleanup = receiveMessage(

      "dashboard-update",

      (dashboardData) => {

        console.log(
          "[SOCKET] Dashboard Updated",
          dashboardData
        );

        setDashboard(dashboardData);

      }

    );

    return cleanup;

  }, [receiveMessage]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getCaptainDashboard();
        setDashboard(data);
      } catch (err) {
        console.error("Dashboard Load Error", err);
      }
    };

    if (captain?._id) {

      loadDashboard();

    }

  }, [captain]);

  // Accept ride
  const handleAcceptRide = async () => {
    if (!rideData?._id) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: rideData._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setRideData(response.data);
        setRidePopupOpen(false);
        setConfirmRidePopupOpen(true);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to accept ride.");
    }
  };

  return (
    <div className="relative h-screen bg-slate-100 overflow-hidden">

      <img
        className="w-16 absolute left-5 top-5 z-10 pointer-events-none"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/960px-Uber_logo_2018.svg.png"
        alt="Uber Logo"
      />

      <a
        href="/captain/logout"
        className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-md hover:bg-slate-100 active:scale-95 transition-all"
      >
        <i className="ri-logout-box-r-line text-xl"></i>
      </a>

      <div className="absolute inset-0">
        <LiveTracking captainLocation={currentLocation} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[32px] bg-white/90 backdrop-blur-xl border-t border-white/40 px-6 py-6 shadow-[0_-20px_60px_rgba(0,0,0,0.15)]">
        <CaptainDetails
          captain={captain}
          dashboard={dashboard}
        />
      </div>

      <RidePopup
        ride={rideData}
        ridePopupOpen={ridePopupOpen}
        setRidePopupOpen={setRidePopupOpen}
        setConfirmRidePopupOpen={handleAcceptRide}
      />

      <ConfirmRidePopup
        ride={rideData}
        confirmRidePopupOpen={confirmRidePopupOpen}
        setConfirmRidePopupOpen={setConfirmRidePopupOpen}
        setRidePopupOpen={setRidePopupOpen}
      />

    </div>
  );
};

export default CaptainHome;