const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses environment variable MONGO_URI for connection string
 */
function connectToDb() {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch(err => console.log('MongoDB Connection Error:', err));
}

module.exports = connectToDb;