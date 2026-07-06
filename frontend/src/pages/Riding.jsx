import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";
import { SocketContext } from "../context/SocketContext";
import 'remixicon/fonts/remixicon.css';

const Riding = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    ride: initialRide,
    selectedRide,
    pickup,
    destination,
    rideEnded: initialRideEnded,
  } = location.state || {};

  const [ride, setRide] = useState(initialRide || null);
  const [rideEnded, setRideEnded] = useState(!!initialRideEnded);
  const [captainLocation, setCaptainLocation] = useState(null);

  const { receiveMessage } = useContext(SocketContext);

  // Listen for live location updates during the ride
  useEffect(() => {
    const cleanup = receiveMessage('captain-location-update', (loc) => {
      setCaptainLocation(loc);
    });
    return cleanup;
  }, [receiveMessage]);

  // Listen for the ride ending while already on this screen
  useEffect(() => {
    const cleanup = receiveMessage('ride-ended', (data) => {
      setRide(data);
      setRideEnded(true);
    });
    return cleanup;
  }, [receiveMessage]);

  // If someone lands on /riding directly with no ride data, send them home
  // instead of showing a fake placeholder ride.
  useEffect(() => {
    if (!ride) {
      navigate('/home', { replace: true });
    }
  }, [ride, navigate]);

  if (!ride) {
    return null;
  }

  const displayRide = selectedRide || {
    name: "UberGo",
    price: `₹${ride.fare ?? ""}`,
    image: "https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png",
  };

  const captainName = `${ride?.captain?.fullname?.firstname || ""} ${ride?.captain?.fullname?.lastname || ""}`.trim();
  const vehiclePlate = ride?.captain?.vehicle?.plate;

  // ADDED: navigates to the new /payment route, carrying the full ride
  // object (needed for fare, captain info, pickup/destination display).
  const handleMakePayment = () => {
    if (!rideEnded) return;
    navigate('/payment', { state: { ride } });
  };

  return (
    <div className="relative h-screen bg-slate-950 overflow-hidden flex flex-col">
      <a href="/home" className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-md hover:bg-slate-100 active:scale-95 transition-all cursor-pointer" aria-label="Go to home">
        <i className="ri-home-3-line text-xl" />
      </a>

      <div className="h-[45%] w-full relative z-0">
        <LiveTracking captainLocation={captainLocation} />
      </div>

      <div className="flex-1 bg-white px-5 py-3.5 flex flex-col justify-between z-10 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] overflow-y-auto rounded-none">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-3.5 text-white shadow-md">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="h-11 w-11 rounded-full border-2 border-white/20 bg-slate-700 flex items-center justify-center text-lg font-bold uppercase">
                  {ride?.captain?.fullname?.firstname?.[0] || 'C'}
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
              </div>
              <div className="text-left">
                <h5 className="font-semibold text-base tracking-wide capitalize">{captainName || "Your Captain"}</h5>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <i className="ri-star-fill text-amber-400" /> 4.9{vehiclePlate ? ` • ${vehiclePlate}` : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="flex flex-col gap-3 rounded-xl bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center h-12 w-16">
                    <span className="absolute animate-ping inline-flex h-8 w-12 rounded-full bg-sky-400 opacity-40"></span>
                    <span className="absolute animate-pulse inline-flex h-12 w-16 rounded-full bg-blue-500 opacity-25 blur-md"></span>
                    <img src={displayRide.image} alt={displayRide.name} className="relative z-10 h-full w-full object-contain" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 tracking-wide">{displayRide.name === "Motorbike" ? "Motor Bike" : displayRide.name}</p>
                    <p className={`text-xs mt-0.5 font-medium animate-pulse ${rideEnded ? "text-emerald-600" : "text-blue-600"}`}>
                      {rideEnded ? "Trip completed" : "Trip in progress..."}
                    </p>
                  </div>
                </div>
                <p className="text-xl font-bold text-slate-900">{displayRide.price}</p>
              </div>

              <div className="space-y-4 text-left relative pl-6 before:absolute before:left-[11px] before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-200">
                <div className="relative">
                  <i className="ri-map-pin-fill absolute -left-[26px] top-0.5 text-base text-red-500 bg-white z-10" />
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {rideEnded ? "Dropped off at" : "Heading to"}
                  </p>
                  <p className="text-sm font-medium text-slate-800 leading-tight mt-0.5 break-words">
                    {destination || ride?.destination || "Destination"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleMakePayment}
            disabled={!rideEnded}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm text-white cursor-pointer shadow-md transition-all ${
              rideEnded
                ? "bg-black hover:bg-slate-800 active:scale-[0.99]"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            <i className="ri-bank-card-line text-lg" />
            {rideEnded ? "Make a Payment" : "Payment available after drop-off"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Riding;