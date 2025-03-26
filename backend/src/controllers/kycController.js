// controllers/kycController.js
const axios = require('axios');

// Hardcoded credentials for Sandbox API (ensure these are for the correct environment)
const API_KEY = 'key_live_hoI6ZA6xd4IJPXbsZthhnGoxECCMlym5';
const API_SECRET = 'secret_live_BL5H2kxZLKSa9yJ0vd9Np7u8aEMgaU4A';
const API_VERSION = '2.0';
const SANDBOX_API_URL = 'https://api.sandbox.co.in';

// Remove token caching variables if you won't be reusing them
// let authToken = null;
// let tokenExpiryTime = null;

// Store reference IDs temporarily (in production, you should store these in a database)
const referenceIdMap = new Map();

// Function to refresh the authentication token
const refreshAuthToken = async () => {
    try {
        const response = await axios.post(
            `${SANDBOX_API_URL}/api/v2/authenticate`,
            {},
            {
                headers: {
                    'x-api-key': API_KEY,
                    'x-api-secret': API_SECRET,
                    'x-api-version': API_VERSION
                }
            }
        );

        // Optional: Log the entire response for debugging
        console.log('Auth Response:', response.data);

        if (response.data && response.data.data && response.data.data.access_token) {
            const newToken = response.data.data.access_token;
            console.log('New authentication token obtained');
            return newToken;
        } else {
            throw new Error('Failed to obtain auth token from response');
        }
    } catch (error) {
        console.error('Error refreshing authentication token:', error);
        throw error;
    }
};

// Function to get a valid authentication token
// Now, it always refreshes the token every time it's called.
const getAuthToken = async () => {
    return await refreshAuthToken();
};

exports.generateOTP = async (req, res) => {
    try {
        const { aadharNumber } = req.body;
        
        // Validate Aadhaar number
        if (!aadharNumber || aadharNumber.length !== 12 || !/^\d+$/.test(aadharNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Aadhaar number. Must be 12 digits.'
            });
        }

        // Get a new authentication token every time
        const token = await getAuthToken();

        // Prepare request to Sandbox API with the "Bearer" prefix added
        const response = await axios.post(
            `${SANDBOX_API_URL}/api/v2/kyc/aadhaar/okyc/otp`, 
            {
                '@entity': 'in.co.sandbox.kyc.aadhaar.okyc.otp.request',
                aadhaar_number: aadharNumber,
                consent: 'y',
                reason: 'For KYC'
            },
            {
                headers: {
                    'Authorization': `${token}`,
                    'x-api-key': API_KEY,
                    'x-api-version': API_VERSION,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Store reference ID against user ID (in this case, we'll use a Map, but in production use a database)
        const userId = req.userId || 'default-user';
        
        if (response.data && response.data.data && response.data.data.reference_id) {
            referenceIdMap.set(userId, response.data.data.reference_id.toString());
        } else {
            throw new Error('Reference ID not found in API response');
        }

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            transactionId: response.data.transaction_id
        });
    } catch (error) {
        console.error('Error generating OTP:', error);
        
        // Handle authentication errors specifically
        if (error.response?.status === 401 || error.response?.data?.message?.includes('token')) {
            return res.status(503).json({
                success: false,
                message: 'Authentication error, please try again',
                error: 'temporary_auth_error'
            });
        }
        
        return res.status(error.response?.status || 500).json({
            success: false,
            message: error.response?.data?.message || 'Failed to generate OTP',
            error: error.message
        });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        
        // Validate OTP
        if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP. Must be 6 digits.'
            });
        }

        const userId = req.userId || 'default-user';
        const referenceId = referenceIdMap.get(userId);
        
        if (!referenceId) {
            return res.status(400).json({
                success: false,
                message: 'No active OTP request found. Please generate OTP first.'
            });
        }

        // Get a new authentication token every time
        const token = await getAuthToken();

        // Prepare request to Sandbox API with the "Bearer" prefix added
        const response = await axios.post(
            `${SANDBOX_API_URL}/api/v2/kyc/aadhaar/okyc/verify`, 
            {
                '@entity': 'in.co.sandbox.kyc.aadhaar.okyc.request',
                reference_id: referenceId,
                otp: otp
            },
            {
                headers: {
                    'Authorization': `${token}`,
                    'x-api-key': API_KEY,
                    'x-api-version': API_VERSION,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data && response.data.data && response.data.data.status === 'valid') {
            referenceIdMap.delete(userId);
            const profileData = response.data.data.profile_data || {};
            
            return res.status(200).json({
                success: true,
                message: 'Aadhaar verification successful',
                data: {
                    status: 'verified',
                    aadhaarNumber: response.data.data.aadhaar_number || 'XXXX-XXXX-XXXX',
                    name: profileData.name || '',
                    dob: profileData.dob || '',
                    gender: profileData.gender || '',
                    address: profileData.address || ''
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'OTP verification failed',
                data: {
                    status: 'failed'
                }
            });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        
        if (error.response?.status === 401 || error.response?.data?.message?.includes('token')) {
            return res.status(503).json({
                success: false,
                message: 'Authentication error, please try again',
                error: 'temporary_auth_error'
            });
        }
        
        return res.status(error.response?.status || 500).json({
            success: false,
            message: error.response?.data?.message || 'Failed to verify OTP',
            error: error.message
        });
    }
};

exports.refreshAuthToken = refreshAuthToken;

// Optional: Health check endpoint for testing token generation
exports.checkAuthStatus = async (req, res) => {
    try {
        const token = await getAuthToken();
        return res.status(200).json({
            success: true,
            message: 'New authentication token obtained',
            token // you may choose not to return the token in production
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to obtain a new token',
            error: error.message
        });
    }
};
