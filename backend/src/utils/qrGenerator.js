const QRCode = require("qrcode");
const crypto = require("crypto");

const generateQRCode = async (data) => {
    try {
        // Create a data URL for the QR code
        console.log("Generating QR code for data:", data);
        
        const qrDataUrl = await QRCode.toDataURL(data);
        return qrDataUrl;
    } catch (error) {
        console.error("Error generating QR code:", error);
        throw new Error("Failed to generate QR code");
    }
};

const generateUniqueQRString = (user) => {
    // Create a unique string using user details
    const uniqueString = `${user.name}_${user.email}_${user.phone}`;

    // Create a hash of the unique string for additional security
    const hash = crypto.createHash("sha256").update(uniqueString).digest("hex");

    // Combine the original string with the hash
    return `${uniqueString}_${hash}`;
};

module.exports = {
    generateQRCode,
    generateUniqueQRString,
};
