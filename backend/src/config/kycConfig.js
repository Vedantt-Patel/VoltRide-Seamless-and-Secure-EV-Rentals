// config.js
require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/your-database',
    jwtSecret: process.env.JWT_SECRET || 'secret_live_BL5H2kxZLKSa9yJ0vd9Np7u8aEMgaU4A',
    
    // Sandbox API config
    sandboxApiUrl: process.env.SANDBOX_API_URL || 'https://api.sandbox-docs.co.in',
    sandboxApiKey: process.env.SANDBOX_API_KEY || 'key_live_hoI6ZA6xd4IJPXbsZthhnGoxECCMlym5'
};