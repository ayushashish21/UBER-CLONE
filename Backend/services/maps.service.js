const axios = require('axios');

// Helper to safely grab the token from the backend .env
const getMapboxToken = () => {
    const token = process.env.MAPBOX_ACCESS_TOKEN || process.env.VITE_MAPBOX_ACCESS_TOKEN || process.env.MAPBOX_API;
    if (!token) throw new Error("Mapbox token is missing in backend .env file");
    return token;
};

module.exports.getAddressCoordinate = async (address, countryCode = '') => {
    const countryParam = countryCode ? `&country=${countryCode.toLowerCase()}` : '';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${getMapboxToken()}${countryParam}&limit=1`;
    
    try {
        const response = await axios.get(url);
        if (response.data.features.length > 0) {
            const coordinates = response.data.features[0].geometry.coordinates;
            return {
                lng: coordinates[0],
                ltd: coordinates[1] 
            };
        }
        throw new Error('No coordinates matched input query parameters.');
    } catch (error) {
        console.error("[MAPBOX_ERROR] Coordinate mapping failed:", error.response?.data || error.message);
        throw new Error(`Mapbox coordinate mapping failed`);
    }
};

module.exports.getDistanceTime = async (origin, destination) => {
    try {
        const startCoords = await module.exports.getAddressCoordinate(origin);
        const endCoords = await module.exports.getAddressCoordinate(destination);
        
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords.lng},${startCoords.ltd};${endCoords.lng},${endCoords.ltd}?access_token=${getMapboxToken()}`;
        
        const response = await axios.get(url);
        if (response.data.routes.length > 0) {
            return {
                distance: { value: response.data.routes[0].distance },
                duration: { value: response.data.routes[0].duration }
            };
        }
        throw new Error('No navigable route found between points.');
    } catch (error) {
        console.error("[MAPBOX_ERROR] Routing failed:", error.response?.data || error.message);
        throw new Error(`Distance computation transaction dropped`);
    }
};

module.exports.getAutoCompleteSuggestions = async (input, countryCode = '') => {
    if (!input) throw new Error('Query context pattern missing');
    
    // Injects the country restriction into the Mapbox query (e.g., &country=in)
    const countryParam = countryCode ? `&country=${countryCode.toLowerCase()}` : '';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?access_token=${getMapboxToken()}${countryParam}&autocomplete=true&limit=5`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.features) {
            // Mapbox v5 standardizes the readable address under 'place_name'
            return response.data.features.map(item => item.place_name);
        }
        return [];
    } catch (error) {
        console.error("[MAPBOX_ERROR] Autocomplete lookup failure:", error.response?.data || error.message);
        throw new Error(`Autocomplete lookup failure`);
    }
};