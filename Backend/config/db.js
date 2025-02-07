const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

function connectDB() {
    // Database connection
    mongoose.connect(process.env.MONGO_CONNECTION_URL
    ).then(() => {
        console.log('😀 Database connection successful.');
    }).catch((err) => {
        console.error('😔 Database connection error ', err);
    })
}

module.exports = connectDB;