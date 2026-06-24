import React from "react";

const LocationSearchPanel = ({ setPickup, setDestination, currentField }) => {
  // Sample data array for recent places
  const locations = [
    "24B, Etwari Bazar, CKP, Jharkhand",
    "25B, Etwari Bazar, CKP, Jharkhand",
    "26B, Etwari Bazar, CKP, Jharkhand",
    "27B, Etwari Bazar, CKP, Jharkhand",
  ];

  const handleLocationClick = (location) => {
    // Optional: Logic to automatically fill the active input field
    if (currentField === "pickup" && setPickup) {
      setPickup(location);
    } else if (currentField === "destination" && setDestination) {
      setDestination(location);
    }
  };

  return (
    <div className="w-full px-2">
      {locations.map((location, index) => (
        <div
          key={index}
          onClick={() => handleLocationClick(location)}
          className="flex items-center justify-start gap-4 my-3 p-3 rounded-xl border-2 border-transparent active:border-black hover:bg-gray-50 cursor-pointer transition-all duration-200"
        >
          {/* Icon Container wrapper */}
          <div className="bg-[#eee] h-10 w-10 shrink-0 flex items-center justify-center rounded-full">
            <i className="ri-map-pin-fill text-lg text-gray-700"></i>
          </div>
          
          {/* Address Text */}
          <p className="font-medium text-sm text-gray-800 leading-tight">
            {location}
          </p>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;