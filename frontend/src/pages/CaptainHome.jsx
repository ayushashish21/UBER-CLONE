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
  }, [captain, sendMessage]);

  useEffect(() => {
    let locationInterval;
    
    if (navigator.geolocation && captain?._id) {
      const sendLocation = (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setCurrentLocation({ lat, lng }); 
        sendMessage('updateLocationCaptain', { userId: captain._id, location: { ltd: lat, lng: lng } });
      };

      navigator.geolocation.getCurrentPosition(sendLocation);

      locationInterval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          sendLocation,
          (error) => console.error("Geolocation Error:", error),
          { enableHighAccuracy: true }
        );
      }, 10000);
    }
    
    return () => clearInterval(locationInterval);
  }, [captain, sendMessage]);

  useEffect(() => {
    const cleanup = receiveMessage('new-ride', (data) => {
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
      alert("Failed to confirm ride.");
    }
  };

  return (
    <div className="relative h-screen bg-slate-100 overflow-hidden">
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