const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const searchController = require("../controllers/search.controller");

router.get(
    "/recent",
    authMiddleware.authUser,
    searchController.getRecentSearches
);

router.post(
    "/save",
    authMiddleware.authUser,
    searchController.saveSearch
);

router.get(
    "/popular",
    authMiddleware.authUser,
    searchController.getPopularLocations
);

module.exports = router;
