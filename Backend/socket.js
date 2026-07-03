const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const rideModel = require('./models/ride.model'); // Added to verify active rides

let io = null;

function initializeSocket(server, options = {}) {
    if (io) {
        return io;
    }

    const { Server } = require('socket.io');

    io = new Server(server, {
        cors: {
            origin: options.origin || ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
            credentials: true,
        },
        ...options,
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;
            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        // PHASE 3: Continuously update captain's live location AND relay to User
        socket.on('updateLocationCaptain', async (data) => {
            const { userId, location } = data;
            
            if (location && location.ltd && location.lng) {
                // 1. Save latest location to the Captain's DB profile
                await captainModel.findByIdAndUpdate(userId, { 
                    'location.lat': location.ltd, 
                    'location.lng': location.lng 
                });

                // 2. Find if this captain is currently assigned to an active ride
                const activeRide = await rideModel.findOne({
                    captain: userId,
                    status: { $in: ['accepted', 'ongoing'] }
                }).populate('user');

                // 3. If they are on a ride, emit the new coordinates securely to the Rider!
                if (activeRide && activeRide.user && activeRide.user.socketId) {
                    io.to(activeRide.user.socketId).emit('captain-location-update', {
                        lat: location.ltd,
                        lng: location.lng
                    });
                }
            }
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
}

function sendMessageToSocketId(socketId, eventName, payload) {
    if (!io) {
        console.warn('Socket.io has not been initialized yet.');
        return false;
    }
    io.to(socketId).emit(eventName, payload);
    return true;
}

module.exports = {
    initializeSocket,
    sendMessageToSocketId,
};