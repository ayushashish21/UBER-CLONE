const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`[SOCKET_CONNECT] Active session assigned payload: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;
            console.log(`[SOCKET_JOINED] Member ID: ${userId} bound to Group role: ${userType}`);
            
            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        socket.on('updateLocationCaptain', async (data) => {
            const { userId, location } = data;
            if (!userId || !location || !location.ltd || !location.lng) {
                console.warn(`[SOCKET_WARN] Invalid telemetry transmission package ignored from connection ${socket.id}`);
                return;
            }

            console.log(`[TELEMETRY_RECEIVE] Driver Profile: ${userId} -> Coordinates: [Lat: ${location.ltd}, Lng: ${location.lng}]`);
            
            try {
                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        ltd: Number(location.ltd),
                        lng: Number(location.lng)
                    }
                });
                console.log(`[TELEMETRY_SYNC] Database successfully persistent updated coordinates for Driver: ${userId}`);
            } catch (err) {
                console.error(`[TELEMETRY_CRASH] Database persistent state tracking write failed: ${err.message}`);
            }
        });

        socket.on('disconnect', () => {
            console.log(`[SOCKET_DISCONNECT] Session expired or dropped: ${socket.id}`);
        });
    });
}

function sendMessageToSocketId(socketId, eventName, messagePayload) {
    if (io) {
        io.to(socketId).emit(eventName, messagePayload);
    } else {
        console.error('[SOCKET_ERROR] Operation blocked. IO pipeline remains uninitialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };