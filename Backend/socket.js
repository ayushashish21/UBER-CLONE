const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let io = null;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`[SOCKET_CONNECT] Connected -> ${socket.id}`);

        /*
        =========================================
        JOIN EVENT
        =========================================
        */
        socket.on("join", async ({ userId, userType }) => {
            try {
                if (!userId || !userType) {
                    console.warn("[SOCKET] Invalid join payload.");
                    return;
                }

                // Prevent duplicate join from same socket
                if (
                    socket.userId === userId &&
                    socket.userType === userType
                ) {
                    return;
                }

                socket.userId = userId;
                socket.userType = userType;

                console.log(
                    `[SOCKET_JOINED] ${userType} : ${userId}`
                );

                if (userType === "user") {
                    await userModel.findByIdAndUpdate(
                        userId,
                        {
                            socketId: socket.id,
                        },
                        {
                            returnDocument: "after",
                        }
                    );
                }

                if (userType === "captain") {
                    await captainModel.findByIdAndUpdate(
                        userId,
                        {
                            socketId: socket.id,
                        },
                        {
                            returnDocument: "after",
                        }
                    );
                }
            } catch (err) {
                console.error("[SOCKET_JOIN_ERROR]", err.message);
            }
        });

        /*
        =========================================
        CAPTAIN LOCATION UPDATE
        =========================================
        */
        socket.on("updateLocationCaptain", async ({ userId, location }) => {
            try {
                if (
                    !userId ||
                    !location ||
                    typeof location.ltd !== "number" ||
                    typeof location.lng !== "number"
                ) {
                    console.warn("[GPS] Invalid location payload.");
                    return;
                }

                console.log(
                    `[GPS] ${userId} -> (${location.ltd}, ${location.lng})`
                );

                await captainModel.findByIdAndUpdate(
                    userId,
                    {
                        location: {
                            ltd: location.ltd,
                            lng: location.lng,
                        },
                    },
                    {
                        returnDocument: "after",
                    }
                );

                console.log("[GPS] Database Updated");
            } catch (err) {
                console.error("[GPS_UPDATE_ERROR]", err.message);
            }
        });

        /*
        =========================================
        DISCONNECT
        =========================================
        */
        socket.on("disconnect", (reason) => {
            console.log(
                `[SOCKET_DISCONNECT] ${socket.id} -> ${reason}`
            );
        });
    });
}

/*
=========================================
SEND EVENT TO SOCKET ID
=========================================
*/
function sendMessageToSocketId(socketId, eventName, payload) {
    if (!io) {
        console.error("[SOCKET] Socket.IO not initialized.");
        return false;
    }

    io.to(socketId).emit(eventName, payload);
    return true;
}

module.exports = {
    initializeSocket,
    sendMessageToSocketId,
};