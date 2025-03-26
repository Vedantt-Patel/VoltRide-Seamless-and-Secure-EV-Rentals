const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

// JWT Secret - using the same hardcoded secret we used in the login controller
const JWT_SECRET = "EV_Rental_Platform_Secret_Key_2023!@#$%^&*";

exports.isAuthenticated = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login."
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again."
      });
    }
    
    // Find user by id from token
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed. Please login again.",
      error: error.message
    });
  }
};