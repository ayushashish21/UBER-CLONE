import React from "react";
import SearchSuggestionItem from "./SearchSuggestionItem";

const RecentSearches = ({
    searches,
    currentField,
    setPickup,
    setDestination
}) => {

    if (!searches.length) return null;

    return (

        <div className="mb-6">

            <h3 className="text-sm font-semibold text-gray-500 mb-3">
                Recent Searches
            </h3>

            {

                searches.map((item, index) => {

                    const value =
                        currentField === "pickup"
                            ? item.pickup
                            : item.destination;

                    return (

                        <SearchSuggestionItem
                            key={index}
                            label={value}
                            onClick={() => {

                                if (currentField === "pickup") {

                                    setPickup(value);

                                } else {

                                    setDestination(value);

                                }

                            }}
                        />

                    );

                })

            }

        </div>

    );

};

export default RecentSearches;