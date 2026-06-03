const mongoose = require('mongoose');

function connectDB() {
    const DB_URL = process.env.MONGO_URI;
    mongoose.connect(DB_URL)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('Connection error:', err));
}
    
module.exports = connectDB;