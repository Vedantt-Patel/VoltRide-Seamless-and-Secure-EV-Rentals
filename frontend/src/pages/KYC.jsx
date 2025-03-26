import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft, CheckCircle, RefreshCw } from "lucide-react";

function KYC() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        aadharNumber: "",
        otp: ""
    });
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Apply input validation
        if (name === "aadharNumber" && !/^\d*$/.test(value)) return;
        if (name === "otp" && !/^\d*$/.test(value)) return;
        
        setFormData({ ...formData, [name]: value });
    };

    const goBack = () => {
        setStep((prev) => prev - 1);
    };

    const makeApiRequest = async (endpoint, data, successMessage) => {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/kyc/${endpoint}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success(successMessage);
                return { success: true, data: response.data };
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            // Handle the specific case where the token was refreshed
            if (error.response?.data?.error === 'temporary_auth_error' && retryCount < 2) {
                setRetryCount((prev) => prev + 1);
                toast.loading('Retrying request...');
                
                // Wait a moment for the backend to complete its token refresh
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Retry the request
                return makeApiRequest(endpoint, data, successMessage);
            }
            
            toast.error(
                error.response?.data?.message || error.message || `Failed to ${endpoint}`
            );
            return { success: false, error };
        }
    };

    const generateOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setRetryCount(0);

        const result = await makeApiRequest(
            "generate-otp",
            { aadharNumber: formData.aadharNumber },
            "OTP sent successfully to your registered mobile number!"
        );

        if (result.success) {
            setStep(2);
        }
        
        setLoading(false);
    };

    const verifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setRetryCount(0);

        const result = await makeApiRequest(
            "verify-otp",
            { otp: formData.otp },
            "Aadhaar verification successful!"
        );

        if (result.success) {
            setVerificationStatus("verified");
            
            // If there's profile data returned, save it
            if (result.data.data) {
                setProfileData(result.data.data);
            }
            
            // Update user profile or store verification status
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } else {
            setVerificationStatus("failed");
        }
        
        setLoading(false);
    };

    // Format Aadhaar number with spaces for display
    const formatAadhaar = (value) => {
        if (!value) return "";
        value = value.replace(/\s/g, "");
        const match = value.match(/^(\d{4})(\d{4})(\d{4})$/);
        if (match) {
            return `${match[1]} ${match[2]} ${match[3]}`;
        }
        return value;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Complete KYC Verification
                </h2>

                {/* Step 1: Aadhaar Number */}
                {step === 1 && (
                    <form onSubmit={generateOTP} className="space-y-6">
                        <div>
                            <label
                                htmlFor="aadharNumber"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Aadhaar Number
                            </label>
                            <input
                                type="text"
                                id="aadharNumber"
                                name="aadharNumber"
                                value={formData.aadharNumber}
                                onChange={handleChange}
                                required
                                pattern="[0-9]{12}"
                                maxLength="12"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter 12-digit Aadhaar number"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                An OTP will be sent to your Aadhaar-linked mobile number
                            </p>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex items-start">
                                <input
                                    id="consent"
                                    name="consent"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                                />
                                <label htmlFor="consent" className="ml-2 block text-sm text-gray-700">
                                    I hereby consent to the use of my Aadhaar details for the purpose of KYC verification
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || formData.aadharNumber.length !== 12}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                    Generating OTP...
                                </>
                            ) : (
                                "Generate OTP"
                            )}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                    <form onSubmit={verifyOTP} className="space-y-6">
                        <div className="text-center mb-4">
                            <p className="text-sm text-gray-600">
                                OTP has been sent to your Aadhaar-linked mobile number
                            </p>
                            <p className="font-medium text-gray-800 mt-1">
                                {formatAadhaar(formData.aadharNumber)}
                            </p>
                        </div>
                        <div>
                            <label
                                htmlFor="otp"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                required
                                maxLength="6"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter 6-digit OTP"
                            />
                            <p className="mt-2 text-sm text-gray-500 flex items-center">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                <button 
                                    type="button" 
                                    onClick={generateOTP} 
                                    className="text-blue-600 hover:underline"
                                    disabled={loading}
                                >
                                    Resend OTP
                                </button>
                            </p>
                        </div>

                        {verificationStatus === "verified" && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                <span className="text-green-700">Aadhaar verification successful!</span>
                            </div>
                        )}

                        {verificationStatus === "failed" && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                                Verification failed. Please check the OTP and try again.
                            </div>
                        )}

                        {profileData && (
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-2">Verified Profile Details</h3>
                                <div className="space-y-1 text-sm">
                                    {profileData.name && <p><span className="font-medium">Name:</span> {profileData.name}</p>}
                                    {profileData.dob && <p><span className="font-medium">DOB:</span> {profileData.dob}</p>}
                                    {profileData.gender && <p><span className="font-medium">Gender:</span> {profileData.gender}</p>}
                                    {profileData.address && <p><span className="font-medium">Address:</span> {profileData.address}</p>}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={goBack}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
                                disabled={loading}
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading || formData.otp.length !== 6 || verificationStatus === "verified"}
                                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                        Verifying OTP...
                                    </>
                                ) : (
                                    "Complete Verification"
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* Progress Steps */}
                <div className="mt-8">
                    <div className="flex justify-between mb-2">
                        <div
                            className={`w-1/2 text-center ${
                                step >= 1 ? "text-green-600 font-medium" : "text-gray-400"
                            }`}
                        >
                            Step 1: Aadhaar Number
                        </div>
                        <div
                            className={`w-1/2 text-center ${
                                step >= 2 ? "text-green-600 font-medium" : "text-gray-400"
                            }`}
                        >
                            Step 2: OTP Verification
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="h-1 w-full bg-gray-200 rounded"></div>
                        </div>
                        <div className="relative flex justify-between">
                            <div>
                                <div className={`h-6 w-6 rounded-full ${step >= 1 ? "bg-green-600" : "bg-gray-300"} flex items-center justify-center text-white text-sm`}>
                                    1
                                </div>
                            </div>
                            <div>
                                <div className={`h-6 w-6 rounded-full ${step >= 2 ? "bg-green-600" : "bg-gray-300"} flex items-center justify-center text-white text-sm`}>
                                    2
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KYC;