import React from "react";

const SearchLoader = () => {
    return (
        <div className="space-y-4 py-4 animate-pulse">

            {[1, 2, 3, 4, 5].map((item) => (

                <div
                    key={item}
                    className="flex items-center gap-4"
                >
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>

                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2 mt-2"></div>
                    </div>

                </div>

            ))}

        </div>
    );
};

export default SearchLoader;