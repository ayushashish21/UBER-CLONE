import React from "react";
import SearchSuggestionItem from "./SearchSuggestionItem";

const PopularLocations = ({
    locations,
    currentField,
    setPickup,
    setDestination
}) => {

    if (!locations.length) return null;

    return (

        <div>

            <h3 className="text-sm font-semibold text-gray-500 mb-3">
                Popular Places
            </h3>

            {

                locations.map((location, index) => (

                    <SearchSuggestionItem
                        key={index}
                        label={location}
                        onClick={() => {

                            if (currentField === "pickup") {

                                setPickup(location);

                            } else {

                                setDestination(location);

                            }

                        }}
                    />

                ))

            }

        </div>

    );

};

export default PopularLocations;