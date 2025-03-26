// services/licenseVerificationService.js

import axios from "axios"

const FLASK_API_URL = import.meta.env.VITE_FLASK_API_URL || "http://localhost:5000"
const NODE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export const verifyIdentity = async (licenseNumber, capturedFaceImage) => {
  try {
    console.log("Starting verification with license number:", licenseNumber)

    // First, get the license image URL from your database
    const licenseImageUrl = await fetchLicenseImageUrl(licenseNumber)
    console.log("Retrieved license image URL:", licenseImageUrl)

    if (!licenseImageUrl) {
      throw new Error("Could not find driver license image")
    }

    // Send both images to your Flask server for comparison
    console.log("Sending request to Flask server:", {
      url: `${FLASK_API_URL}/api/compare-faces`,
      licenseImageUrl,
      hasCapturedImage: !!capturedFaceImage,
    })

    const response = await axios.post(`${FLASK_API_URL}/api/compare-faces`, {
      licenseImageUrl,
      capturedFaceImage,
    })

    console.log("Flask server response:", response.data)
    return response.data
  } catch (error) {
    console.error("Identity verification error:", error)
    throw error
  }
}

export const fetchLicenseImageUrl = async (licenseNumber) => {
  try {
    console.log("Fetching license URL for:", licenseNumber)
    // Get the license URL from the Node.js backend
    const response = await axios.get(`${NODE_API_URL}/api/licenses/${licenseNumber}`)
    console.log("License URL response:", response.data)
    return response.data.imageUrl
  } catch (error) {
    console.error("Error fetching license image URL:", error)
    throw error
  }
}

