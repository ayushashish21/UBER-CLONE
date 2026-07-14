const Captain = require("../models/captain.model");
const dashboardService = require("../services/dashboard.service");
const { sendMessageToSocketId } = require("../socket");

const emitDashboardUpdate = async (captainId) => {
    try {
        if (!captainId) return;

        const dashboard =
            await dashboardService.getCaptainDashboard(captainId);

        const captain = await Captain.findById(captainId).select("socketId");

        if (!captain) return;

        if (!captain.socketId) return;

        sendMessageToSocketId(
            captain.socketId,
            "dashboard-update",
            dashboard
        );
    } catch (error) {
        console.error(
            "[DASHBOARD SOCKET]",
            error.message
        );
    }
};

module.exports = {
    emitDashboardUpdate,
};