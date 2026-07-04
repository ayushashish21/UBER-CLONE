import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import 'remixicon/fonts/remixicon.css';
import CaptainDetails from "../components/CaptainDetails";
import RidePopup from "../components/RidePopup"; 
import ConfirmRidePopup from "../components/ConfirmRidePopup";
import LiveTracking from "../components/LiveTracking"; 
import { SocketContext } from "../context/SocketContext";
import { useCaptainContext } from "../context/CaptainContext";

const CaptainHome = () => {
  const [ridePopupOpen, setRidePopupOpen] = useState(false);
  const [confirmRidePopupOpen, setConfirmRidePopupOpen] = useState(false);
  const [rideData, setRideData] = useState(null); 
  const [currentLocation, setCurrentLocation] = useState(null); 

  const { connect, sendMessage, receiveMessage } = useContext(SocketContext);
  const { captain } = useCaptainContext();

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (captain && captain._id) {
      sendMessage('join', { userId: captain._id, userType: 'captain' });
    }
  }, [captain]);

  // COMPLETE HTML5 BROWSER GEOLOCATION INTERFACE ROUTINE
  useEffect(() => {
    let locationInterval;
    
    if (navigator.geolocation && captain?._id) {
      const dispatchLocationFrame = (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setCurrentLocation({ lat, lng }); 
        
        // Emits structural data every 10 seconds via updateLocationCaptain channel
        sendMessage('updateLocationCaptain', {
          userId: captain._id,
          location: { ltd: lat, lng: lng }
        });
      };

      navigator.geolocation.getCurrentPosition(dispatchLocationFrame, 
        (err) => console.error("[GEOLOCATION_ERROR]", err.message),
        { enableHighAccuracy: true }
      );

      locationInterval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          dispatchLocationFrame,
          (error) => console.error("[GEOLOCATION_ERROR]", error.message),
          { enableHighAccuracy: true }
        );
      }, 10000);
    }
    
    return () => clearInterval(locationInterval);
  }, [captain, sendMessage]);

  useEffect(() => {
    const cleanup = receiveMessage('new-ride', (data) => {
      console.log("[SOCKET] Incoming production ride matched payload payload:", data);
      setRideData(data);
      setRidePopupOpen(true);
    });
    return cleanup; 
  }, [receiveMessage]);

  const handleAcceptRide = async () => {
    if (!rideData?._id) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        { rideId: rideData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setRideData(response.data); 
        setRidePopupOpen(false);
        setConfirmRidePopupOpen(true);
      }
    } catch (error) {
      console.error("[TRANSACTION_REJECTED]", error.message);
      alert("Failed to secure matched ride selection.");
    }
  };

  return (
    <div className="relative h-screen bg-slate-100 overflow-hidden">
      
      {/* MODULAR DEBUGGING TESTING POPUP CONTROL BUTTON */}
      <button 
        onClick={() => {
          console.log("[DEBUG_UI] Captain received local testing notification trigger.");
          console.log("[DEBUG_UI] State modification request: Open Ride Notification Modal.");
          const testingDataMock = {
            pickup: "Local Node Proximity Street, Ranchi Center",
            destination: "Railway Terminus Hub Exit Road, Ranchi",
            fare: 480,
            user: { fullname: { firstname: "Debug", lastname: "Customer Profile" } }
          };
          console.log("[DEBUG_UI] Current bound testing object metadata:", testingDataMock);
          setRideData(testingDataMock);
          setRidePopupOpen(true);
          console.log("[DEBUG_UI] Interactive modal panel opened visually.");
        }}
        className="absolute top-24 left-5 z-50 bg-amber-500 hover:bg-amber-600 transition-colors text-white text-xs px-3 py-2 rounded-xl font-bold shadow-md active:scale-95 transform"
      >
        Test Ride UI Alert Window
      </button>

      <img
        className="w-16 absolute left-5 top-5 z-10 pointer-events-none"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/960px-Uber_logo_2018.svg.png"
        alt="Uber Logo"
      />

      <a href="/captain/logout" className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-md hover:bg-slate-100 active:scale-95 transition-all cursor-pointer">
        <i className="ri-logout-box-r-line text-xl" />
      </a>

      <div className="absolute inset-0 h-full w-full z-0">
        <LiveTracking captainLocation={currentLocation} />
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-white px-6 py-6 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] rounded-none border-t border-slate-200">
        <CaptainDetails captain={captain} />
      </div>

      <RidePopup ride={rideData} ridePopupOpen={ridePopupOpen} setRidePopupOpen={setRidePopupOpen} setConfirmRidePopupOpen={handleAcceptRide} />
      <ConfirmRidePopup ride={rideData} confirmRidePopupOpen={confirmRidePopupOpen} setConfirmRidePopupOpen={setConfirmRidePopupOpen} setRidePopupOpen={setRidePopupOpen} />
    </div>
  );
};

export default CaptainHome;