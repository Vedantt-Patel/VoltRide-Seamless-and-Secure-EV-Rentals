const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const connectDB = require("./config/database.js");



// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

// Import routes - check if they exist before using them
const authRoutes = require("./routes/auth");
// Uncomment these as you implement them
// const userRoutes = require('./routes/users');
const vehicleRoutes = require('./routes/vehicle');
const locationRoutes = require("./routes/location");
// const contractRoutes = require('./routes/contracts');
const kycRoutes = require("./routes/kyc");
const otpRoutes = require("./routes/otp");
const bookingRoutes = require("./routes/booking");
const pickupRoutes = require("./routes/pickupRoutes");
const userBookingRoutes = require("./routes/userBooking");

app.use('/api', pickupRoutes);
app.use('/api', userBookingRoutes);

// Routes
app.use("/api/auth", authRoutes);
// Uncomment these as you implement them
// app.use('/api/users', userRoutes);
// app.use('/api/vehicles', vehicleRoutes);
app.use("/api/locations", locationRoutes);
// app.use('/api/contracts', contractRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/bookings", bookingRoutes);
app.use('/api', vehicleRoutes);
app.use('/api/kyc', kycRoutes);

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, {
        query: req.query,
        body: req.body,
        headers: req.headers,
    });
    next();
});

// Basic route for testing
app.get("/", (req, res) => {
    res.json({ message: "EV Rental API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Global error handler:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
    });
});

// Start server only after connecting to MongoDB
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        console.log("MongoDB connected successfully");
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();

module.exports = app;
