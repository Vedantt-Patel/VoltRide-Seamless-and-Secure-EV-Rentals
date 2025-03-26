const twilio = require('twilio');
const User = require('../models/User'); // Make sure path is correct

// Initialize Twilio client with your credentials
const client = twilio(
  );
const twilioPhoneNumber = '+14155238886';

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via WhatsApp
const sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required' 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Format phone number for WhatsApp - must include country code and prefix
    const whatsappNumber = `whatsapp:${phoneNumber}`;
    
    // Send message via Twilio using approved WhatsApp template
    await client.messages.create({
      from: 'whatsapp:+14155238886',
      contentSid: 'HX229f5a04fd0510ce1b071852155d3e75',
      contentVariables: JSON.stringify({ "1": otp }),
      to: whatsappNumber
    });    
    
    res.status(200).json({
      success: true,
      message: 'Verification code sent to WhatsApp'
    });
    
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification code',
      error: error.message
    });
  }
};

// Verify the OTP entered by user
const verifyOTP = async (req, res) => {
    try {
      const { phoneNumber, otp } = req.body;
      
      if (!phoneNumber || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Phone number and OTP are required'
        });
      }

      // Send confirmation message via WhatsApp
      const whatsappNumber = `whatsapp:${phoneNumber}`;
      await client.messages.create({
        body: 'Your phone number has been successfully verified. Thank you!',
        from: 'whatsapp:+14155238886',
        to: whatsappNumber
      });
      
      res.status(200).json({
        success: true,
        message: 'Phone number verified successfully'
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Verification failed',
        error: error.message
      });
    }
  };

module.exports = {
  sendOTP,
  verifyOTP
};