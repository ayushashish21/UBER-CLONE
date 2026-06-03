const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses environment variable DB_CONNECT for connection string
 */
function connectToDb() {
    mongoose.connect(process.env.DB_CONNECT)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch(err => console.log('MongoDB Connection Error:', err));
}

module.exports = connectToDb;