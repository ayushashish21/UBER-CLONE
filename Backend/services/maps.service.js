const axios = require("axios");


module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.MAPBOX_ACCESS_TOKEN;

    if (!apiKey) {
        throw new Error("Mapbox access token is missing.");
    }

    try {
        const encodedAddress = encodeURIComponent(address);

        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?limit=1&access_token=${apiKey}`;

        const response = await axios.get(url);

        if (
            response.data &&
            response.data.features &&
            response.data.features.length > 0
        ) {
            const [lng, lat] =
                response.data.features[0].geometry.coordinates;

            return {
                lat,
                lng,
            };
        }

        throw new Error("Address not found");
    } catch (err) {
        console.error(err.message);
        throw err;
    }
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error("Origin and destination are required");
    }

    const apiKey = process.env.MAPBOX_ACCESS_TOKEN;

    const originCoords = await module.exports.getAddressCoordinate(origin);
    const destinationCoords = await module.exports.getAddressCoordinate(destination);

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords.lng},${originCoords.lat};${destinationCoords.lng},${destinationCoords.lat}?overview=false&access_token=${apiKey}`;

    try {
        const response = await axios.get(url);

        if (
            response.data &&
            response.data.routes &&
            response.data.routes.length > 0
        ) {
            const route = response.data.routes[0];

            // Raw values
            const distance = route.distance;
            const duration = route.duration;

            // Formatted values
            const distanceText = `${(distance / 1000).toFixed(2)} km`;

            const days = Math.floor(duration / 86400);
            const hours = Math.floor((duration % 86400) / 3600);
            const minutes = Math.floor((duration % 3600) / 60);

            let durationText = "";

            if (days > 0)
                durationText += `${days} day${days > 1 ? "s" : ""} `;

            if (hours > 0)
                durationText += `${hours} hour${hours > 1 ? "s" : ""} `;

            if (minutes > 0)
                durationText += `${minutes} minute${minutes > 1 ? "s" : ""}`;

            return {
                distance,
                duration,
                distanceText,
                durationText: durationText.trim()
            };
        }

        throw new Error("No route found.");
    } catch (err) {
        console.error(err.message);
        throw err;
    }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error("Query is required");
    }

    const apiKey = process.env.MAPBOX_ACCESS_TOKEN;

    if (!apiKey) {
        throw new Error("Mapbox access token is missing.");
    }

    try {
        const encodedInput = encodeURIComponent(input);

        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedInput}.json?autocomplete=true&limit=5&access_token=${apiKey}`;

        const response = await axios.get(url);

        if (
            response.data &&
            response.data.features
        ) {
            return response.data.features.map((place) => ({
                name: place.place_name,
                coordinates: {
                    lat: place.center[1],
                    lng: place.center[0]
                }
            }));
        }

        return [];
    } catch (err) {
        console.error(err.message);
        throw err;
    }
};