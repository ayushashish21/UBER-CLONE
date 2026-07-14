const dashboardService = require("../services/dashboard.service");

/**
 * GET /dashboard
 * Returns captain dashboard statistics
 */
module.exports.getCaptainDashboard = async (req, res) => {
    try {

        const captainId = req.captain._id;

        const dashboard = await dashboardService.getCaptainDashboard(captainId);

        return res.status(200).json({
            success: true,
            dashboard
        });

    } catch (error) {

        console.error("Dashboard Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load dashboard."
        });

    }
};