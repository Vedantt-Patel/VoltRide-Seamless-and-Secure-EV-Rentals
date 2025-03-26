const axios = require("axios");
require("dotenv").config();

const sandboxApi = axios.create({
    baseURL: "https://api.sandbox.co.in",
    headers: {
        "x-api-key": "key_live_hoI6ZA6xd4IJPXbsZthhnGoxECCMlym5",
        "x-api-version": "2.0",
        "Authorization": "eyJhbGciOiJIUzUxMiJ9.eyJhdWQiOiJBUEkiLCJyZWZyZXNoX3Rva2VuIjoiZXlKaGJHY2lPaUpJVXpVeE1pSjkuZXlKaGRXUWlPaUpCVUVraUxDSnpkV0lpT2lKc2RYWndNakV4TWtCbmJXRnBiQzVqYjIwaUxDSmhjR2xmYTJWNUlqb2lhMlY1WDJ4cGRtVmZhRzlKTmxwQk5uaGtORWxLVUZoaWMxcDBhR2h1UjI5NFJVTkRUV3g1YlRVaUxDSnBjM01pT2lKaGNHa3VjMkZ1WkdKdmVDNWpieTVwYmlJc0ltVjRjQ0k2TVRjM05ESXlPVEkzTVN3aWFXNTBaVzUwSWpvaVVrVkdVa1ZUU0Y5VVQwdEZUaUlzSW1saGRDSTZNVGMwTWpZNU16STNNWDAuTGlhSDZoaXFKTTEtMmVwbnNDODE4NkFvNjN2WWlZY3pqY3BtdzhESWszczhMMFM1M0ZZOUxmQUhjNEI1TGRhNkhJUzlIMU5jay04aFlkQU5EQk5Ha3ciLCJzdWIiOiJsdXZwMjExMkBnbWFpbC5jb20iLCJhcGlfa2V5Ijoia2V5X2xpdmVfaG9JNlpBNnhkNElKUFhic1p0aGhuR294RUNDTWx5bTUiLCJpc3MiOiJhcGkuc2FuZGJveC5jby5pbiIsImV4cCI6MTc0Mjc3OTY3MSwiaW50ZW50IjoiQUNDRVNTX1RPS0VOIiwiaWF0IjoxNzQyNjkzMjcxfQ.VmR-LlOBprx-e9kI-oCpGRqoplmDzlNXEEXAj6QopL_HK-CjGDiP5F4rV72VOgYlJR6_T3vF-ae4nz-iqpEKeA",
    },
});

const generateAadhaarOTP = async (aadhaarNumber) => {
    try {
        const response = await sandboxApi.post("/kyc/aadhaar/okyc/otp", {
            "@entity": "in.co.sandbox.kyc.aadhaar.okyc.otp.request",
            aadhaar_number: aadhaarNumber,
            consent: "y",
            reason: "For KYC",
        });
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to generate OTP"
        );
    }
};

const verifyAadhaarOTP = async (referenceId, otp) => {
    try {
        const response = await sandboxApi.post("/kyc/aadhaar/okyc/verify", {
            "@entity": "in.co.sandbox.kyc.aadhaar.okyc.request",
            reference_id: referenceId,
            otp: otp,
        });
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to verify OTP"
        );
    }
};

module.exports = {
    generateAadhaarOTP,
    verifyAadhaarOTP,
};


