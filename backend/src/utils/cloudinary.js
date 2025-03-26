const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure cloudinary directly with the provided keys
cloudinary.config({
    cloud_name: 'dztczonvg',
    api_key: '568652438848767',
    api_secret: '6NqCP2s_Z_Vqne1j5ek6IGcppcQ'
});

// Verify configuration is loaded correctly
console.log("Cloudinary Configuration Status:", {
    isConfigured: !!cloudinary.config().cloud_name,
    cloudName: cloudinary.config().cloud_name
});

// Upload file to cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log("Starting Cloudinary upload for:", localFilePath);
        
        if (!localFilePath) {
            console.error("File path is undefined or null");
            return null;
        }
        
        // Check if file exists
        if (!fs.existsSync(localFilePath)) {
            console.error(`File not found at path: ${localFilePath}`);
            // Log directory contents to help debug
            try {
                const tempDir = path.dirname(localFilePath);
                console.log(`Contents of ${tempDir}:`, fs.readdirSync(tempDir));
            } catch (err) {
                console.error("Error listing directory:", err);
            }
            return null;
        }
        
        // Check file size
        const stats = fs.statSync(localFilePath);
        console.log(`File size: ${stats.size} bytes`);
        
        if (stats.size === 0) {
            console.error("File is empty (0 bytes)");
            return null;
        }
        
        // Upload the file
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "app_uploads", // Optional: organize uploads in a folder
            timeout: 60000 // Set a longer timeout (60 seconds)
        });
        
        // File has been uploaded successfully
        console.log(`File uploaded to Cloudinary: ${response.url}`);
        
        // Now remove the file from local storage
        fs.unlinkSync(localFilePath);
        
        return response;
    } catch (error) {
        // More detailed error logging
        console.error("Cloudinary upload failed with error:");
        console.error(error); // Log the full error object
        
        if (error.http_code) {
            console.error(`HTTP Status Code: ${error.http_code}`);
        }
        
        if (error.message) {
            console.error(`Error message: ${error.message}`);
        }
        
        // Remove the locally saved temporary file as the upload operation failed
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        return null;
    }
};

// Export using CommonJS syntax
module.exports = { uploadOnCloudinary };
