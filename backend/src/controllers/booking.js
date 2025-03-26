const Vehicle = require("../models/Vehicle");
const User = require("../models/User");
const Booking = require("../models/Booking");
const {
    generateQRCode,
    generateUniqueQRString,
} = require("../utils/qrGenerator");
const QRCode = require("qrcode");
const { validationResult } = require("express-validator");

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { vehicleId, stationId, pickupDate, pickupTime, dropoffDate, dropoffTime, paymentMethod, duration } = req.body;

        console.log(req.body);
        const userId = req.body.userId;

        console.log(userId);

        // Validate required fields
        if (!vehicleId || !stationId || !pickupDate || !pickupTime || !dropoffDate || !dropoffTime || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // Check if vehicle exists and is available
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }

        // Calculate the booking duration in hours
        const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
        const dropoffDateTime = new Date(`${dropoffDate}T${dropoffTime}`);
        const durationInHours = Math.max(1, Math.ceil((dropoffDateTime - pickupDateTime) / (1000 * 60 * 60)));

        
        const totalAmount = (durationInHours * vehicle.pricePerHour);

        // Check if user has sufficient wallet balance if using wallet payment
        if (paymentMethod === "wallet") {
            const user = await User.findById(userId);
            if (user.wallet.balance < totalAmount) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient wallet balance",
                });
            }
        }

        // Generate QR code for the booking
        const qrString = generateUniqueQRString('pickup', userId, vehicleId);
        const qrCode = await QRCode.toDataURL(qrString);

        console.log(qrCode);

        // Create the booking
        const booking = await Booking.create({
            user: userId,
            vehicle: vehicleId,
            station: stationId,
            pickupDate: pickupDateTime,
            duration: durationInHours,
            totalAmount,
            paymentMethod,
            qrCode: qrString,
            status: "pending"
        });

        // Update vehicle status
        vehicle.status = "UNAVAILABLE";
        await vehicle.save();

        // Deduct amount from user's wallet if using wallet payment
        if (paymentMethod === "wallet") {
            const user = await User.findById(userId);
            user.wallet.balance -= totalAmount;
            user.wallet.transactions.push({
                type: "DEBIT",
                amount: totalAmount,
                description: `Booking payment for vehicle ${vehicle.numberPlate}`,
            });
            await user.save();
        }

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: {
                booking,
                qrCode,
            },
        });
    } catch (error) {
        console.error("Booking creation error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating booking",
            error: error.message,
        });
    }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("vehicle", "name numberPlate image pricePerHour")
            .populate("station", "name address")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching bookings",
            error: error.message,
        });
    }
};

// Get booking details by ID
exports.getBookingDetails = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("vehicle", "name numberPlate image pricePerHour")
            .populate("station", "name address")
            .populate("user", "name email phone");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Check if the user is authorized to view this booking
        if (
            booking.user._id.toString() !== req.user._id.toString() 
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this booking",
            });
        }

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        console.error("Error fetching booking details:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching booking details",
            error: error.message,
        });
    }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Check if the user is authorized to cancel this booking
        if (
            booking.user.toString() !== req.user._id.toString() &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to cancel this booking",
            });
        }

        // Check if booking can be cancelled
        if (booking.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Booking cannot be cancelled at this stage",
            });
        }

        // Refund the amount to user's wallet if payment was made using wallet
        if (booking.paymentMethod === "wallet") {
            const user = await User.findById(booking.user);
            user.wallet.balance += booking.totalAmount;
            user.wallet.transactions.push({
                type: "CREDIT",
                amount: booking.totalAmount,
                description: `Refund for cancelled booking ${booking._id}`,
            });
            await user.save();
        }

        // Update vehicle status
        const vehicle = await Vehicle.findById(booking.vehicle);
        vehicle.status = "AVAILABLE";
        await vehicle.save();

        // Update booking status
        booking.status = "cancelled";
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking,
        });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({
            success: false,
            message: "Error cancelling booking",
            error: error.message,
        });
    }
};

// Verify QR code for pickup/return
exports.verifyQRCode = async (req, res) => {
    try {
        const { qrCode, type } = req.body; // type can be 'pickup' or 'return'
        
        const booking = await Booking.findOne({
            qrCode: qrCode,
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Invalid QR code",
            });
        }

        // Update booking status based on verification type
        if (type === "pickup") {
            booking.status = "active";
            booking.pickupTime = new Date();
        } else if (type === "return") {
            booking.status = "completed";
            booking.returnTime = new Date();
            
            // Update vehicle status to AVAILABLE
            const vehicle = await Vehicle.findById(booking.vehicle);
            vehicle.status = "AVAILABLE";
            await vehicle.save();
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: `QR code verified successfully for ${type}`,
            data: booking,
        });
    } catch (error) {
        console.error("Error verifying QR code:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying QR code",
            error: error.message,
        });
    }
};

// Extend booking duration
exports.extendBooking = async (req, res) => {
    try {
        const { additionalHours } = req.body;
        const bookingId = req.params.id;
        
        if (!additionalHours || additionalHours <= 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid number of additional hours",
            });
        }
        
        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }
        
        // Verify user owns this booking
        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to extend this booking",
            });
        }
        
        // Check if booking can be extended (only active bookings)
        if (booking.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Only active bookings can be extended",
            });
        }
        
        // Get vehicle details for pricing
        const vehicle = await Vehicle.findById(booking.vehicle);
        
        // Calculate additional cost
        const additionalCost = additionalHours * vehicle.pricePerHour;
        
        // Update booking duration and total amount
        booking.duration += additionalHours;
        booking.totalAmount += additionalCost;
        
        // Process payment
        if (booking.paymentMethod === "wallet") {
            const user = await User.findById(booking.user);
            
            // Check if user has sufficient balance
            if (user.wallet.balance < additionalCost) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient wallet balance for extension",
                });
            }
            
            // Deduct from wallet
            user.wallet.balance -= additionalCost;
            user.wallet.transactions.push({
                type: "DEBIT",
                amount: additionalCost,
                description: `Extension payment for booking ${booking._id}`,
            });
            await user.save();
        }
        
        await booking.save();
        
        res.status(200).json({
            success: true,
            message: "Booking extended successfully",
            data: booking,
        });
    } catch (error) {
        console.error("Error extending booking:", error);
        res.status(500).json({
            success: false,
            message: "Error extending booking",
            error: error.message,
        });
    }
};

// Add pickup details
exports.addPickupDetails = async (req, res) => {
    try {
        const { vehicleImages, pickupNotes } = req.body;
        const bookingId = req.params.id;
        
        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }
        
        // Only station staff or admin should be able to add pickup details
        if (req.user.role !== "STAFF" && req.user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to add pickup details",
            });
        }
        
        // Booking must be in active status to add pickup details
        if (booking.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Pickup details can only be added for active bookings",
            });
        }
        
        // Update booking with pickup details
        booking.vehicleImages = vehicleImages || [];
        booking.pickupNotes = pickupNotes || "";
        
        await booking.save();
        
        res.status(200).json({
            success: true,
            message: "Pickup details added successfully",
            data: booking,
        });
    } catch (error) {
        console.error("Error adding pickup details:", error);
        res.status(500).json({
            success: false,
            message: "Error adding pickup details",
            error: error.message,
        });
    }
};

// Add return details
exports.addReturnDetails = async (req, res) => {
    try {
        const { returnImages, damageReport, returnNotes } = req.body;
        const bookingId = req.params.id;
        
        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }
        
        // Only station staff or admin should be able to add return details
        if (req.user.role !== "STAFF" && req.user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to add return details",
            });
        }
        
        // Booking must be in active status to add return details
        if (booking.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Return details can only be added for active bookings",
            });
        }
        
        // Update booking with return details
        booking.returnImages = returnImages || [];
        booking.returnNotes = returnNotes || "";
        
        if (damageReport) {
            booking.damageReport = {
                hasDamages: damageReport.hasDamages || false,
                notes: damageReport.notes || "",
                estimatedRepairCost: damageReport.estimatedRepairCost || 0,
            };
        }
        
        // Update booking status to completed
        booking.status = "completed";
        booking.returnTime = new Date();
        
        // Update vehicle status
        const vehicle = await Vehicle.findById(booking.vehicle);
        
        // If vehicle has damages, mark it as MAINTENANCE, otherwise AVAILABLE
        if (damageReport && damageReport.hasDamages) {
            vehicle.status = "MAINTENANCE";
        } else {
            vehicle.status = "AVAILABLE";
        }
        
        await vehicle.save();
        await booking.save();
        
        res.status(200).json({
            success: true,
            message: "Return details added successfully",
            data: booking,
        });
    } catch (error) {
        console.error("Error adding return details:", error);
        res.status(500).json({
            success: false,
            message: "Error adding return details",
            error: error.message,
        });
    }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        
        const queryOptions = {};
        
        // Filter by status if provided
        if (status) {
            queryOptions.status = status;
        }
        
        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const bookings = await Booking.find(queryOptions)
            .populate("vehicle", "name numberPlate image pricePerHour")
            .populate("station", "name address")
            .populate("user", "name email phone")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        // Get total count for pagination
        const total = await Booking.countDocuments(queryOptions);
        
        res.status(200).json({
            success: true,
            data: bookings,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching bookings",
            error: error.message,
        });
    }
};

// Update booking status (admin only)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const bookingId = req.params.id;
        
        const validStatuses = ["pending", "active", "completed", "cancelled"];
        
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid status",
            });
        }
        
        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }
        
        // Update booking status
        booking.status = status;
        
        // Additional actions based on status change
        if (status === "active" && !booking.pickupTime) {
            booking.pickupTime = new Date();
        } else if (status === "completed" && !booking.returnTime) {
            booking.returnTime = new Date();
        }
        
        // Update vehicle status based on booking status
        const vehicle = await Vehicle.findById(booking.vehicle);
        
        if (status === "active") {
            vehicle.status = "UNAVAILABLE";
        } else if (status === "completed" || status === "cancelled") {
            vehicle.status = "AVAILABLE";
        }
        
        await vehicle.save();
        await booking.save();
        
        res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            data: booking,
        });
    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({
            success: false,
            message: "Error updating booking status",
            error: error.message,
        });
    }
};

// Get booking statistics (admin only)
exports.getBookingStats = async (req, res) => {
    try {
        // Get total count for each status
        const statusCounts = await Booking.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        
        // Get total revenue
        const revenue = await Booking.aggregate([
            {
                $match: { status: { $in: ["completed", "active"] } },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" },
                },
            },
        ]);
        
        // Get bookings per day for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const bookingsPerDay = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
            },
        ]);
        
        // Format the response
        const formattedStatusCounts = statusCounts.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});
        
        const formattedBookingsPerDay = bookingsPerDay.map((item) => {
            const date = new Date(item._id.year, item._id.month - 1, item._id.day);
            return {
                date: date.toISOString().split("T")[0],
                count: item.count,
            };
        });
        
        res.status(200).json({
            success: true,
            data: {
                statusCounts: formattedStatusCounts,
                totalRevenue: revenue.length > 0 ? revenue[0].total : 0,
                bookingsPerDay: formattedBookingsPerDay,
            },
        });
    } catch (error) {
        console.error("Error fetching booking statistics:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching booking statistics",
            error: error.message,
        });
    }
};