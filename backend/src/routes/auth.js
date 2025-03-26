const express = require("express");
const router = express.Router();
const { register, login, getMe, verifyToken } = require("../controllers/auth");
const { isAuthenticated } = require("../middleware/auth.js");
const { check } = require("express-validator");
const multer = require("multer");
const path = require("path");
const { upload } = require("../middleware/multer.middleware.js");

// Register route with correct multer field name
router.post(
    "/register",
    upload.fields([{ name: 'drivingLicense', maxCount: 1 }]),
    register
);


// Login route
router.post(
    "/login",
    [
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password is required").exists(),
    ],
    login
);

router.get("/currentuser", isAuthenticated, getMe);

// Verify token route
router.get("/verify-token", verifyToken);

module.exports = router;
