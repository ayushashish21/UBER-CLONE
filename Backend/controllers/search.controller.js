const searchService = require("../services/search.service");

module.exports.getRecentSearches = async (req, res) => {

    try {

        const searches = await searchService.getRecentSearches(
            req.user._id
        );

        res.status(200).json(searches);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to fetch recent searches"
        });

    }

};

module.exports.saveSearch = async (req, res) => {

    try {

        const { pickup, destination } = req.body;

        if (!pickup || !destination) {

            return res.status(400).json({
                message: "Pickup and destination are required"
            });

        }

        const searches = await searchService.saveSearch(
            req.user._id,
            pickup,
            destination
        );

        res.status(200).json(searches);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to save search"
        });

    }

};

module.exports.getPopularLocations = async (req, res) => {

    try {

        const locations =
            await searchService.getPopularLocations(
                req.user.country
            );

        res.status(200).json(locations);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to fetch popular locations"
        });

    }

};