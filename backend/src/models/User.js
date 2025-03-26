const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },
    qrCode: {
        type: String,
        unique: true
    },
    drivingLicense: {
        number: {
            type: String,
            // required: true,
        },
        image: {
            type: String,
            // required: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    wallet: {
        balance: {
            type: Number,
            default: 0,
        },
        transactions: [
            {
                type: {
                    type: String,
                    enum: ["CREDIT", "DEBIT"],
                },
                amount: Number,
                description: String,
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    kycStatus: {
        type: String,
        enum: ["PENDING", "VERIFIED", "REJECTED"],
        default: "PENDING",
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate QR code
userSchema.methods.generateQRCode = function () {
    // Create a unique string using username, email, and phone
    const uniqueString = `${this.name}_${this.email}_${this.phone}`;
    // You can add additional encryption or hashing here if needed
    return uniqueString;
};

// Add this after schema definition
userSchema.index({ qrCode: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("User", userSchema);
