const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const { upload } = require("../middleware/multer.middleware.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const fs = require("fs");

// JWT Secret
const JWT_SECRET = "EV_Rental_Platform_Secret_Key_2023!@#$%^&*";


// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

exports.verifyToken = async (req, res) => {
    try {
      // Get token from header
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }
      
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Find user by id
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Token is valid',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
      
    } catch (error) {
      console.error('Token verification error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to verify token',
        error: error.message
      });
    }
  };

// Register user
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password, drivingLicenseNumber } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        console.log("Request files:", req.files);
        console.log("Request body:", req.body);

        const drivingLicenseImage = req.files?.drivingLicense && req.files.drivingLicense[0]?.path;
        console.log("Driving license image path:", drivingLicenseImage);

        if (!drivingLicenseImage) {
            return res.status(400).json({
                success: false,
                message: "drivingLicenseImage is required",
            });
        }

        console.log("About to upload to cloudinary with path:", drivingLicenseImage);
        const drivingLicense = await uploadOnCloudinary(drivingLicenseImage);
        console.log("Cloudinary response:", drivingLicense);

        // Create new user with proper driving license structure
        const uniqueQRCode = 'QR_' + Date.now() + '_' + Math.round(Math.random() * 1000000);
        user = new User({
            name,
            email,
            phone,
            password,
            qrCode: uniqueQRCode,
            drivingLicense: {
                number: drivingLicenseNumber,
                image: drivingLicense?.url || "" ,
                verified: false,
            },
        });

        await user.save();

        // Create token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                drivingLicense: user.drivingLicense,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Error in registration",
            error: error.message,
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }

        // Find user by email
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if password matches
        // Make sure this method exists on your User model
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Define a hardcoded secret key for development
        // IMPORTANT: In production, you should use environment variables
        const JWT_SECRET = "EV_Rental_Platform_Secret_Key_2023!@#$%^&*";

        // Create JWT token with the hardcoded secret
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "3d" }
        );

        // Remove password from response
        user.password = undefined;

        // Send response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user,
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Error logging in",
            error: error.message,
        });
    }
};

// Get current logged in user
exports.getMe = async (req, res) => {
    try {
        // The user should be available from the authentication middleware
        const user = req.user;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Get current user error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get user information",
            error: error.message,
        });
    }
};

// Logout user
exports.logout = async (req, res) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
};

// Update password
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide current and new password",
            });
        }

        const user = await User.findById(req.user.id).select("+password");

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        user.password = newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating password",
            error: error.message,
        });
    }
};

// Helper function to get token and create cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    res.status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                kycStatus: user.kycStatus,
                phone: user.phone,
                drivingLicense: user.drivingLicense,
            },
        });
};
