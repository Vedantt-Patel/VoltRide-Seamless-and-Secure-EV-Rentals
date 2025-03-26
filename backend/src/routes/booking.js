const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const {
    createBooking,
    getUserBookings,
    getBookingDetails,
    cancelBooking,
    verifyQRCode,
    extendBooking,
    addPickupDetails,
    addReturnDetails,
    getAllBookings,
    updateBookingStatus,
    getBookingStats
} = require("../controllers/booking");

// All routes are protected and require authentication
// router.use(isAuthenticated);

// User routes
router.post("/", createBooking);
router.get("/my-bookings", getUserBookings);
router.get("/:id", getBookingDetails);
router.post("/:id/cancel", cancelBooking);
router.post("/:id/extend", extendBooking);

// QR verification
router.post("/verify-qr", verifyQRCode);

// // Staff and admin routes
// router.post("/:id/pickup-details", authorizeRoles(["STAFF", "ADMIN"]), addPickupDetails);
// router.post("/:id/return-details", authorizeRoles(["STAFF", "ADMIN"]), addReturnDetails);

// // Admin-only routes
// router.get("/", authorizeRoles(["ADMIN"]), getAllBookings);
// router.patch("/:id/status", authorizeRoles(["ADMIN"]), updateBookingStatus);
// router.get("/stats/dashboard", authorizeRoles(["ADMIN"]), getBookingStats);

module.exports = router;