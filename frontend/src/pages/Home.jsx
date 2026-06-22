import React from "react";
import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LocationSearchPanel from "../components/LocationSearchPanel";
import 'remixicon/fonts/remixicon.css'; // Added Remix Icon css import

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  
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

  React.useEffect(() => {
    if (pickup && destination && !panelOpen) {
      setPanelOpen(true);
    }
  }, [pickup, destination]);

  useGSAP(
    () => {
      gsap.to(panelRef.current, {
        height: panelOpen ? "calc(100vh - 260px)" : "0px",
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
  };

  return (
    <div className="relative h-screen bg-slate-950 text-slate-950 overflow-hidden">
      {/* Uber Logo */}
      <img
        className="w-16 absolute left-5 top-5 z-10"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/960px-Uber_logo_2018.svg.png"
        alt="Uber Logo"
      />

      {/* Map Background */}
      <div className="h-full w-full absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrTkHb14vVfomlEOWqrpKvN6xHaP6rHYlw0HnrqcTEEw&s=10"
          alt="uber map background"
        />
      </div>

      {/* Bottom Interface Layer */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end z-20 pointer-events-none">
        
        {/* Main Search Inputs Card */}
        <div
          ref={mainCardRef}
          className="find-trip-card w-full bg-white/95 p-5 pt-8 shadow-2xl backdrop-blur-xl pointer-events-auto"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-2xl font-semibold text-slate-900 tracking-wide">
                {selectedRide ? "Confirm Booking" : "Find a trip"}
              </h4>
              <p className="mt-1 text-sm text-slate-500">
                {selectedRide
                  ? `${selectedRide.name === "Motorbike" ? "Motor Bike" : selectedRide.name} - ${selectedRide.price}`
                  : pickup && destination
                  ? "✓ Ready to choose a ride."
                  : "Pick a ride and enter the route to begin."}
              </p>
            </div>
            
            <div className="flex gap-2">
              {(pickup || destination) && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="inline-flex h-10 px-3 items-center justify-center rounded-full bg-red-50 text-xs font-medium text-red-600 hover:bg-red-100 active:scale-95 transition"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setPanelOpen((open) => !open)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-700 hover:bg-slate-200 active:scale-95 transition"
                aria-label={panelOpen ? "Close panel" : "Open panel"}
              >
                <i className={`ri-arrow-${panelOpen ? "down" : "up"}-s-line`} />
              </button>
            </div>
          </div>

          {!selectedRide && (
            <form onSubmit={submitHandler} className="mt-6 space-y-3">
              <div className="relative rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm hover:border-slate-400 hover:bg-slate-100/50 focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all duration-200 cursor-text">
                <i className="ri-map-pin-fill absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                <input
                  onClick={() => setPanelOpen(true)}
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
                  onClick={() => setPanelOpen(true)}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent pl-11 text-base text-slate-900 outline-none placeholder-slate-400"
                  type="text"
                  placeholder="Enter your destination"
                />
              </div>
            </form>
          )}

          {selectedRide && (
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="mb-2 text-sm font-semibold text-slate-600 text-center">Selected Ride</p>
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white p-4 shadow-sm text-center">
                  <img src={selectedRide.image} alt={selectedRide.name} className="h-10 w-16 object-contain mx-auto" />
                  <div>
                    <p className="font-semibold text-slate-900 tracking-wide">
                      {selectedRide.name === "Motorbike" ? "Motor Bike" : selectedRide.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedRide.time}</p>
                  </div>
                  <p className="text-lg font-bold text-slate-900 mt-1">{selectedRide.price}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setSelectedRide(null); setPanelOpen(true); }}
                  className="flex-1 rounded-3xl bg-slate-200 px-4 py-3 text-center font-semibold text-slate-900 hover:bg-slate-300 active:scale-95 transition-all"
                >
                  Change Ride
                </button>
                <button className="flex-1 rounded-3xl bg-black px-4 py-3 text-center font-semibold text-white hover:bg-slate-800 active:scale-95 transition-all">
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Slide-up Selection Drawer Sheet Popup */}
        <div
          ref={panelRef}
          className="w-full overflow-hidden bg-white shadow-2xl flex flex-col pointer-events-auto h-0"
        >
          <div className="border-b border-slate-100 px-5 py-4 flex-shrink-0 text-center">
            <div className="mx-auto h-1 w-12 rounded-full bg-slate-300" />
            <h5 className="mt-3 text-lg font-semibold text-slate-900 tracking-wide">
              {pickup && destination ? "Choose a Ride" : "Recent places"}
            </h5>
          </div>
          
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {pickup && destination ? (
              <div className="space-y-3 pb-4">
                {rides.map((ride) => (
                  <button
                    key={ride.id}
                    onClick={() => {
                      setTimeout(() => {
                        setSelectedRide(ride);
                        setPanelOpen(false);
                      }, 200);
                    }}
                    className="flex flex-col w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none transition-all duration-200 hover:border-slate-400 hover:bg-slate-100/50 focus:ring-2 focus:ring-black focus:border-black active:bg-slate-200 active:scale-[0.99] text-center"
                  >
                    <img 
                      src={ride.image} 
                      alt={ride.name} 
                      className="h-10 w-16 object-contain mx-auto" 
                    />
                    <div>
                      {/* UPDATED: Replaced original (X seats) structure with inline Remix Icon wrapper */}
                      <p className="inline-flex items-center justify-center gap-1 font-semibold text-slate-900 tracking-wide">
                        {ride.name === "Motorbike" ? "Motor Bike" : ride.name}
                        <span className="inline-flex items-center gap-0.5 text-xs font-normal text-slate-400 ml-1">
                          <i className="ri-user-fill text-[11px]" /> {ride.seats}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{ride.time} • {ride.description}</p>
                    </div>
                    <p className="text-lg font-bold text-slate-900 mt-1">{ride.price}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="hover-fields-container [&_div]:transition-all [&_div]:duration-200 [&_div:hover]:bg-slate-100/50 [&_div:hover]:border-slate-400 [&_div:active]:scale-[0.99] cursor-pointer">
                <LocationSearchPanel />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;