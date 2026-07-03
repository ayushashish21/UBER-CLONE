import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import LiveTracking from "../components/LiveTracking";
import 'remixicon/fonts/remixicon.css';
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";

const Home = () => {
  const [panelType, setPanelType] = useState("search");
  const [panelOpen, setPanelOpen] = useState(false);

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedRide, setSelectedRide] = useState(null);
  const [activeField, setActiveField] = useState(null);

  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [fareLoading, setFareLoading] = useState(false);
  const [rideError, setRideError] = useState("");
  const [rideOptions, setRideOptions] = useState([]);
  
  const [confirmedRideData, setConfirmedRideData] = useState(null);
  const [captainLocation, setCaptainLocation] = useState(null);

  const { connect, sendMessage, receiveMessage } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (!user || !user._id) return; 
    sendMessage('join', { userType: 'user', userId: user._id });
  }, [user, sendMessage]); 

  // Listen for Ride Acceptance
  useEffect(() => {
    const cleanup = receiveMessage('ride-confirmed', (data) => {
      setConfirmedRideData(data);
      setPanelOpen(false); 
      setPanelType("accepted"); 
    });
    return cleanup; 
  }, [receiveMessage]);

  // PHASE 4: Listen for live location updates from the backend
  useEffect(() => {
    const cleanup = receiveMessage('captain-location-update', (location) => {
      setCaptainLocation(location);
    });
    return cleanup; 
  }, [receiveMessage]);

  const panelRef = useRef(null);
  const mainCardRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const handleLocationFieldFocus = (field) => {
    setPanelType("search");
    setPanelOpen(true);
    setActiveField(field);
  };

  useEffect(() => {
    const query = activeField === "pickup" ? pickup : activeField === "destination" ? destination : "";

    if (!query || query.trim().length < 3) {
      setSearchSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
          params: { input: query.trim() },
          headers,
        });
        setSearchSuggestions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch location suggestions", error);
        setSearchSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [activeField, pickup, destination]);

  const fetchFares = async (pickupStr, destStr) => {
    setFareLoading(true);
    setRideError("");
    setPanelType("vehicle");
    setPanelOpen(true);

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
        params: { pickup: pickupStr.trim(), destination: destStr.trim() },
        headers,
      });

      const fareMap = data?.fare || {};

      setRideOptions([
        {
          id: "car",
          name: "UberGo",
          seats: 4,
          time: "2 mins away",
          description: "Affordable, Compact rides for everyone",
          price: `₹${fareMap.car ?? 199}`,
          vehicleType: "car",
          image: "https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png",
        },
        {
          id: "motorcycle",
          name: "Motorbike",
          seats: 1,
          time: "2 mins away",
          description: "Affordable, Motorbike rides for everyone",
          price: `₹${fareMap.motorcycle ?? 99}`,
          vehicleType: "motorcycle",
          image: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85NTM4NTEyZC1mZGUxLTRmNzMtYmQ1MS05Y2VmZjRlMjU0ZjEucG5n",
        },
        {
          id: "auto",
          name: "UberAuto",
          seats: 3,
          time: "2 mins away",
          description: "Affordable, Auto rides for everyone",
          price: `₹${fareMap.auto ?? 49}`,
          vehicleType: "auto",
          image: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=0/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy80ZTcxOGQ1Yy1lNDMxLTU5YzUtYWNiNS1hYzQwYzI2YzI0ZGYud2VicA==",
        }
      ]);
    } catch (error) {
      console.error("Failed to fetch fare", error);
      setRideError("Could not calculate fares right now.");
    } finally {
      setFareLoading(false);
    }
  };

  const handleSetPickup = (value) => {
    setPickup(value);
    setSearchSuggestions([]);
  };

  const handleSetDestination = (value) => {
    setDestination(value);
    setSearchSuggestions([]);
  };

  const handleFindTrip = () => {
    if (pickup && destination) {
      fetchFares(pickup, destination);
    }
  };

  const handleClearSelection = () => {
    setPanelType("search");
    setPanelOpen(false);
    setSelectedRide(null);
    setPickup("");
    setDestination("");
    setActiveField(null);
    setSearchSuggestions([]);
    setRideError("");
    setConfirmedRideData(null);
    setCaptainLocation(null);
  };

  const handleConfirmRide = async () => {
    if (!selectedRide || !pickup || !destination) return;

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup: pickup.trim(),
          destination: destination.trim(),
          vehicleType: selectedRide.vehicleType,
        },
        { headers }
      );

      setRideError("");
      setPanelType("looking"); 
    } catch (error) {
      // THIS WILL NOW PRINT THE EXACT BACKEND REJECTION REASON:
      console.error("Backend Error Details:", error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || "Could not create ride.";
      setRideError(errorMessage);
    }
  };

  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panelOpen ? "100%" : "0px",
      paddingBottom: panelOpen ? "24px" : "0px",
      duration: 0.5,
      ease: "power3.out",
    });
  }, [panelOpen]);

  return (
    <div className="relative h-screen bg-slate-950 text-slate-950 overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5 z-10 pointer-events-none"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/960px-Uber_logo_2018.svg.png"
        alt="Uber Logo"
      />

      {/* GPS Tracking Overlay (Optional/Debugging) */}
      {panelType === "accepted" && captainLocation && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg border border-slate-700 flex items-center gap-2 animate-bounce">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono font-bold tracking-wider">
            GPS: {captainLocation.lat.toFixed(4)}, {captainLocation.lng.toFixed(4)}
          </span>
        </div>
      )}

      {/* Live Map Component */}
      <div className="h-full w-full absolute inset-0 z-0">
        <LiveTracking captainLocation={captainLocation} />
      </div>

      <div className={`absolute inset-x-0 bottom-0 flex flex-col justify-end z-20 pointer-events-none ${panelOpen ? "h-screen" : "h-auto"}`}>
        <div ref={mainCardRef} className="find-trip-card w-full bg-white p-5 pt-5 pointer-events-auto flex-shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] rounded-t-2xl z-30">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-2xl font-bold text-slate-900 tracking-wide">
                {panelType === "looking" ? "Looking for a Driver"
                  : panelType === "confirm" ? "Confirm Ride"
                  : panelType === "accepted" ? "Driver is on the way!"
                  : "Find a trip"}
              </h4>
              <p className="mt-1 text-sm text-slate-500">
                {panelType === "looking" ? "Searching for a nearby captain to accept your ride..."
                  : panelType === "confirm" && selectedRide ? `${selectedRide.name} - ${selectedRide.price}`
                  : panelType === "accepted" ? `Meet ${confirmedRideData?.captain?.fullname?.firstname} at pickup location.`
                  : pickup && destination ? "✓ Ready to choose a ride."
                  : "Pick a ride and enter the route to begin."}
              </p>
            </div>

            <div className="flex gap-2 items-center">
              {(pickup || destination) && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="inline-flex h-10 px-4 items-center justify-center rounded-full bg-red-50 text-xs font-semibold text-red-600 cursor-pointer hover:bg-red-100 active:scale-95 transition duration-200"
                >
                  Clear
                </button>
              )}

              {(panelType === "search" || panelType === "vehicle") && (
                <button
                  type="button"
                  onClick={() => setPanelOpen((open) => !open)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-700 hover:bg-slate-200 active:scale-95 transition"
                >
                  <i className={`ri-arrow-${panelOpen ? "down" : "up"}-s-line`} />
                </button>
              )}
            </div>
          </div>

          {(panelType === "search" || panelType === "vehicle") && (
            <form onSubmit={submitHandler} className="mt-4 space-y-3">
              <div className="relative rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm hover:border-slate-400 hover:bg-slate-100/50 focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all duration-200 cursor-text">
                <i className="ri-map-pin-fill absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                <input
                  onClick={() => handleLocationFieldFocus("pickup")}
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full bg-transparent pl-11 text-base text-slate-900 outline-none placeholder-slate-400"
                  type="text"
                  placeholder="Enter pickup location"
                />
              </div>

              <div className="relative rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm hover:border-slate-400 hover:bg-slate-100/50 focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all duration-200 cursor-text">
                <i className="ri-map-pin-fill absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                <input
                  onClick={() => handleLocationFieldFocus("destination")}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent pl-11 text-base text-slate-900 outline-none placeholder-slate-400"
                  type="text"
                  placeholder="Enter your destination"
                />
              </div>

              {pickup && destination && panelType === "search" && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleFindTrip}
                    className="w-full bg-black text-white font-bold py-3.5 rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-md"
                  >
                    Find a Trip
                  </button>
                </div>
              )}
            </form>
          )}

          {panelType === "confirm" && (
            <ConfirmRide
              selectedRide={selectedRide}
              pickup={pickup}
              destination={destination}
              error={rideError}
              onChangeRide={() => {
                setPanelType("vehicle");
                setPanelOpen(true);
              }}
              onConfirm={handleConfirmRide}
            />
          )}

          {panelType === "looking" && (
            <LookingForDriver
              selectedRide={selectedRide}
              pickup={pickup}
              destination={destination}
            />
          )}

          {panelType === "accepted" && (
            <WaitingForDriver 
              selectedRide={selectedRide} 
              pickup={pickup} 
              destination={destination}
              driverData={confirmedRideData}
              onCancel={handleClearSelection} 
            />
          )}

        </div>

        <div ref={panelRef} className="w-full overflow-hidden bg-white flex flex-col pointer-events-auto h-0 z-20 relative -mt-4 pt-4">
          <div className="flex-1 overflow-y-auto px-5 py-1">
            {panelType === "search" && (
              <LocationSearchPanel
                setPickup={handleSetPickup}
                setDestination={handleSetDestination}
                currentField={activeField}
                suggestions={searchSuggestions}
                loading={isLoadingSuggestions}
              />
            )}

            {panelType === "vehicle" && (
              <VehiclePanel
                rides={rideOptions}
                loading={fareLoading}
                pickup={pickup}
                destination={destination}
                onSelectRide={(ride) => {
                  setSelectedRide(ride);
                  setPanelType("confirm");
                  setPanelOpen(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;