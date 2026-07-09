import React from "react";
import SearchLoader from "./SearchLoader";
import SearchSuggestionItem from "./SearchSuggestionItem";
import RecentSearches from "./RecentSearches";
import PopularLocations from "./PopularLocations";

const LocationSearchPanel = ({
  setPickup,
  setDestination,
  currentField,
  suggestions = [],
  loading = false,
  recentSearches = [],
  popularLocations = []
}) => {

  const getDisplayLabel = (location) => {
    if (typeof location === "string") return location;
    return location?.name || location?.place_name || "Unknown location";
  };

  return (
    <div className="w-full px-2">

      {loading ? (

        <SearchLoader />

      ) : suggestions.length > 0 ? (

        suggestions.map((location, index) => {

          const label = getDisplayLabel(location);

          return (
            <SearchSuggestionItem
              key={`${label}-${index}`}
              label={label}
              onClick={() => {

                if (currentField === "pickup") {

                  setPickup(label);

                } else {

                  setDestination(label);

                }

              }}
            />
          );

        })

      ) : (

        <>

          <RecentSearches
            searches={recentSearches}
            currentField={currentField}
            setPickup={setPickup}
            setDestination={setDestination}
          />

          <PopularLocations
            locations={popularLocations}
            currentField={currentField}
            setPickup={setPickup}
            setDestination={setDestination}
          />

        </>

      )}

    </div>
  );
};

export default LocationSearchPanel;