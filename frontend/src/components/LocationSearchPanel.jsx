import React from "react";

const LocationSearchPanel = ({ setPickup, setDestination, currentField, suggestions = [], loading = false }) => {
  const getDisplayLabel = (location) => {
    if (typeof location === "string") return location;
    return location?.name || location?.place_name || "Unknown location";
  };

  return (
    <div className="w-full px-2">
      {loading ? (
        <div className="py-4 text-sm text-slate-500">Searching locations...</div>
      ) : suggestions.length === 0 ? (
        <div className="py-4 text-sm text-slate-500">Type at least 3 characters to see suggestions.</div>
      ) : (
        suggestions.map((location, index) => {
          const label = getDisplayLabel(location);

          return (
            <div
              key={`${label}-${index}`}
              onClick={() => {
                if (currentField === "pickup" && setPickup) setPickup(label);
                else if (currentField === "destination" && setDestination) setDestination(label);
              }}
              className="flex items-center justify-start gap-4 my-3 p-3 rounded-xl border-2 border-transparent active:border-black hover:bg-gray-50 cursor-pointer transition-all duration-200"
            >
              <div className="bg-[#eee] h-10 w-10 shrink-0 flex items-center justify-center rounded-full">
                <i className="ri-map-pin-fill text-lg text-gray-700"></i>
              </div>
              <p className="font-medium text-sm text-gray-800 leading-tight text-left">{label}</p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default LocationSearchPanel;