const userModel = require("../models/user.model");

const popularLocations = {
    IN: [
        "Airport",
        "Railway Station",
        "Bus Stand",
        "Metro Station",
        "Shopping Mall",
        "Hospital",
        "University"
    ],

    US: [
        "Airport",
        "Downtown",
        "Shopping Mall",
        "Hospital",
        "University",
        "Train Station"
    ],

    GB: [
        "Airport",
        "Railway Station",
        "City Centre",
        "Hospital",
        "University"
    ]
};

module.exports.getRecentSearches = async (userId) => {

    const user = await userModel
        .findById(userId)
        .select("recentSearches");

    if (!user) return [];

    return user.recentSearches || [];

};

module.exports.saveSearch = async (
    userId,
    pickup,
    destination
) => {

    const user = await userModel.findById(userId);

    if (!user) throw new Error("User not found");

    user.recentSearches.unshift({
        pickup,
        destination,
        createdAt: new Date()
    });

    user.recentSearches = user.recentSearches.slice(0, 10);

    await user.save();

    return user.recentSearches;

};

module.exports.getPopularLocations = async (country) => {

    return (
        popularLocations[country] ||
        popularLocations["IN"]
    );

};