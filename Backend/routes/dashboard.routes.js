const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * GET /dashboard
 * Returns dashboard statistics for the logged-in captain
 */
router.get(
    "/",
    authMiddleware.authCaptain,
    dashboardController.getCaptainDashboard
);

module.exports = router;