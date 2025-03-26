"use client";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import PhoneVerification from "./PhoneVerification";
import toast from "react-hot-toast";
import { CheckCircle } from "lucide-react";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        drivingLicenseNumber: "",
    });
    const [drivingLicense, setDrivingLicense] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showPhoneVerification, setShowPhoneVerification] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        // Reset phone verification if phone number changes
        if (e.target.name === "phone" && isPhoneVerified) {
            setIsPhoneVerified(false);
        }
    };

    const handleFileChange = (e) => {
        setDrivingLicense(e.target.files[0]);
    };

    const handlePhoneVerification = () => {
        if (!formData.phone) {
            toast.error("Please enter a phone number first");
            return;
        }
        setShowPhoneVerification(true);
    };

    const handlePhoneVerified = (verifiedPhone) => {
        setIsPhoneVerified(true);
        setShowPhoneVerification(false);
        // Optionally update the phone in formData with the verified one
        if (verifiedPhone !== formData.phone) {
            setFormData({ ...formData, phone: verifiedPhone });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if phone is verified
        if (!isPhoneVerified) {
            toast.error("Please verify your phone number before registering");
            return;
        }

        setLoading(true);
        setError("");
        setUploadProgress(0);

        try {
            // Create FormData for file upload
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                formDataToSend.append(key, formData[key]);
            });

            // Add the driving license file
            if (drivingLicense) {
                formDataToSend.append("drivingLicense", drivingLicense);
            } else {
                throw new Error("Driving license image is required");
            }

            // Add phone verification status
            formDataToSend.append("isPhoneVerified", isPhoneVerified);

            console.log("Sending registration data:", formDataToSend);

            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        console.log(`Upload progress: ${percentCompleted}%`);
                        setUploadProgress(percentCompleted);
                    },
                }
            );

            console.log("Full API response:", response);

            // Handle successful registration
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // Show success message before redirecting
            toast.success("Registration successful! Please login to continue.");

            // Redirect to login page
            navigate("/login");
        } catch (error) {
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });

            setError(
                error.response?.data?.message ||
                    error.message ||
                    "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Create an Account
            </h2>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Phone
                        </label>
                        <div className="flex">
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                disabled={loading || isPhoneVerified}
                                className={`flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    isPhoneVerified ? "bg-gray-50" : ""
                                }`}
                            />
                            <button
                                type="button"
                                onClick={handlePhoneVerification}
                                disabled={loading || isPhoneVerified}
                                className={`px-4 py-2 rounded-r-lg ${
                                    isPhoneVerified
                                        ? "bg-green-100 text-green-800 border border-green-300"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                            >
                                {isPhoneVerified ? (
                                    <span className="flex items-center">
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Verified
                                    </span>
                                ) : (
                                    "Verify"
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            minLength="6"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="drivingLicenseNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Driving License Number
                    </label>
                    <input
                        type="text"
                        id="drivingLicenseNumber"
                        name="drivingLicenseNumber"
                        value={formData.drivingLicenseNumber}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label
                        htmlFor="drivingLicense"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Driving License Image
                    </label>
                    <input
                        type="file"
                        id="drivingLicense"
                        name="drivingLicense"
                        onChange={handleFileChange}
                        accept="image/*"
                        required
                        disabled={loading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Upload a clear image of your driving license (max 5MB)
                    </p>
                </div>

                <button
                    type="submit"
                    className={`w-full py-3 rounded-lg transition-colors ${
                        isPhoneVerified
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                    disabled={loading || !isPhoneVerified}
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>

            {/* Loader Component with upload progress */}
            {loading && (
                <Loader
                    message={
                        uploadProgress > 0
                            ? `Uploading: ${uploadProgress}% complete`
                            : "Processing your registration..."
                    }
                />
            )}

            <p className="mt-6 text-center">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                    Login
                </a>
            </p>

            {/* Phone Verification Modal */}
            {showPhoneVerification && (
                <PhoneVerification
                    phoneNumber={formData.phone}
                    onVerified={handlePhoneVerified}
                    onCancel={() => setShowPhoneVerification(false)}
                />
            )}
        </div>
    );
};

export default Register;
