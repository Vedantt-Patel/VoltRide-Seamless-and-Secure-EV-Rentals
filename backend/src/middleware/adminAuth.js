const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// JWT Secret - using the same secret as the main auth middleware
const JWT_SECRET = "EV_Rental_Platform_Secret_Key_2023!@#$%^&*";

exports.isAdmin = async (req, res, next) => {
    try {
        // Get token from header
        const token =
            req.headers.authorization?.split(" ")[1] || req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login.",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please login again.",
            });
        }

        // Find user by id from token
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if user is an admin
        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required.",
            });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error("Admin authentication error:", error);
        return res.status(401).json({
            success: false,
            message: "Authentication failed. Please login again.",
            error: error.message,
        });
    }
};
