import React from "react";

const SearchSuggestionItem = ({
    label,
    onClick
}) => {

    return (

        <div
            onClick={onClick}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition"
        >

            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <i className="ri-map-pin-fill text-gray-700"></i>
            </div>

            <div>

                <h4 className="font-medium text-sm">
                    {label}
                </h4>

            </div>

        </div>

    );

};

export default SearchSuggestionItem;