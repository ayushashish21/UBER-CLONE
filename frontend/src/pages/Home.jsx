import React, { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import 'remixicon/fonts/remixicon.css';

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [lookingForDriver, setLookingForDriver] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  
  const panelRef = useRef(null);
  const mainCardRef = useRef(null);

  const rides = [
    {
      id: 1,
      name: "UberGo",
      seats: 4,
      time: "2 mins away",
      description: "Affordable, Compact rides for everyone",
      price: "₹199",
      image: "https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png", 
    },
    {
      id: 2,
      name: "Motorbike",
      seats: 1,
      time: "2 mins away",
      description: "Affordable, Motorbike rides for everyone",
      price: "₹99",
      image: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85NTM4NTEyZC1mZGUxLTRmNzMtYmQ1MS05Y2VmZjRlMjU0ZjEucG5n", 
    },
    {
      id: 3,
      name: "UberAuto",
      seats: 3,
      time: "2 mins away",
      description: "Affordable, Auto rides for everyone",
      price: "₹49",
      image: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=0/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy80ZTcxOGQ1Yy1lNDMxLTU5YzUtYWNiNS1hYzQwYzI2YzI0ZGYud2VicA==", 
    },
  ];

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (pickup && destination && !panelOpen && !lookingForDriver && !waitingForDriver) {
      setPanelOpen(true);
    }
  }, [pickup, destination]);

  // GSAP clean viewport sliding layout control
  useGSAP(
    () => {
      gsap.to(panelRef.current, {
        height: panelOpen ? "100%" : "0px",
        paddingBottom: panelOpen ? "24px" : "0px",
        duration: 0.5, 
        ease: "power3.out", 
      });
    },
    [panelOpen]
  );

  const handleClearSelection = () => {
    setSelectedRide(null);
    setPickup("");
    setDestination("");
    setPanelOpen(false);
    setActiveField(null);
    setLookingForDriver(false);
    setWaitingForDriver(false);
  };

  const handleCancelRide = () => {
    setWaitingForDriver(false);
    setLookingForDriver(false);
    setSelectedRide(null);
    setPanelOpen(true);
  };

  return (
    <div className="relative h-screen bg-slate-950 text-slate-950 overflow-hidden">
      {/* Uber Logo */}
      <img
        className="w-16 absolute left-5 top-5 z-10 pointer-events-none"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/960px-Uber_logo_2018.svg.png"
        alt="Uber Logo"
      />

      {/* Map Background */}
      <div 
        onClick={() => setPanelOpen(false)}
        className="h-full w-full absolute inset-0 z-0 cursor-pointer"
      >
        <img
          className="w-full h-full object-cover"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrTkHb14vVfomlEOWqrpKvN6xHaP6rHYlw0HnrqcTEEw&s=10"
          alt="uber map background"
        />
      </div>

      {/* Bottom Interface Layer */}
      <div className={`absolute inset-x-0 bottom-0 flex flex-col justify-end z-20 pointer-events-none ${panelOpen ? "h-screen" : "h-auto"}`}>
        
        {/* Main Card Container */}
        <div ref={mainCardRef} className="find-trip-card w-full bg-white p-5 pt-5 pointer-events-auto flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-2xl font-bold text-slate-900 tracking-wide">
                {waitingForDriver ? "Meet Your Driver" : lookingForDriver ? "Looking for a ride" : selectedRide ? "Confirm Ride" : "Find a trip"}
              </h4>
              <p className="mt-1 text-sm text-slate-500">
                {waitingForDriver
                  ? "Driver is arriving at your location"
                  : lookingForDriver 
                  ? "Connecting with nearby drivers..."
                  : selectedRide
                  ? `${selectedRide.name === "Motorbike" ? "Motor Bike" : selectedRide.name} - ${selectedRide.price}`
                  : pickup && destination
                  ? "✓ Ready to choose a ride."
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
              
              {!selectedRide && !lookingForDriver && !waitingForDriver && (
                <button
                  type="button"
                  onClick={() => setPanelOpen((open) => !open)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-700 hover:bg-slate-200 active:scale-95 transition"
                  aria-label={panelOpen ? "Close panel" : "Open panel"}
                >
                  <i className={`ri-arrow-${panelOpen ? "down" : "up"}-s-line`} />
                </button>
              )}
            </div>
          </div>

          {!selectedRide ? (
            <form onSubmit={submitHandler} className="mt-4 space-y-3">
              <div className="relative rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm hover:border-slate-400 hover:bg-slate-100/50 focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all duration-200 cursor-text">
                <i className="ri-map-pin-fill absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                <input
                  onClick={() => { setPanelOpen(true); setActiveField("pickup"); }}
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
                  onClick={() => { setPanelOpen(true); setActiveField("destination"); }}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent pl-11 text-base text-slate-900 outline-none placeholder-slate-400"
                  type="text"
                  placeholder="Enter your destination"
                />
              </div>
            </form>
          ) : waitingForDriver ? (
            <WaitingForDriver 
              selectedRide={selectedRide}
              pickup={pickup}
              destination={destination}
              onCancel={handleCancelRide}
            />
          ) : lookingForDriver ? (
            <LookingForDriver 
              selectedRide={selectedRide}
              pickup={pickup}
              destination={destination}
              setLookingForDriver={setLookingForDriver}
              setWaitingForDriver={setWaitingForDriver}
            />
          ) : (
            <ConfirmRide 
              selectedRide={selectedRide} 
              setSelectedRide={setSelectedRide} 
              setPanelOpen={setPanelOpen} 
              pickup={pickup}
              destination={destination}
              onConfirm={() => setLookingForDriver(true)}
            />
          )}
        </div>

        {/* Dynamic Slide-up Sheet Panel Wrapper */}
        <div ref={panelRef} className="w-full overflow-hidden bg-white flex flex-col pointer-events-auto h-0">
          <div className="flex-1 overflow-y-auto px-5 py-1">
            {pickup && destination ? (
              <VehiclePanel 
                rides={rides}
                pickup={pickup}
                destination={destination}
                setSelectedRide={setSelectedRide}
                setPanelOpen={setPanelOpen}
              />
            ) : (
              <div className="w-full">
                <LocationSearchPanel 
                  setPickup={setPickup} 
                  setDestination={setDestination} 
                  currentField={activeField} 
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;