const mongoose = require("mongoose");
// Remove the DB_NAME import since it's included in the URI now
// const { DB_NAME } = require('../constants');

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect('mongodb+srv://Mihir_181:Mihir4200n%40%40%40@cluster0.vt92z.mongodb.net/EvRental');
        console.log(`\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`);
        return connectionInstance;
    } catch (error) {
        console.error("MongoDB connection failed", error);
        process.exit(1);
    }
}

module.exports = connectDB;


