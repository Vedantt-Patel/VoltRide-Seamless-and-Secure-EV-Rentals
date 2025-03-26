"use client"

import { useState, useEffect } from "react"
import QRScanner from "./QRScanner"
import toast from "react-hot-toast"

const EBikeDropOffForm = () => {
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dropOffPhotos, setDropOffPhotos] = useState([])
  const [licenseImageUrl, setLicenseImageUrl] = useState(null)
  const [entryMethod, setEntryMethod] = useState(null) // 'qr' or 'manual'
  const [bookingId, setBookingId] = useState("") // Added state for bookingId
  const [formData, setFormData] = useState({
    bikeId: "",
    userDetails: {
      name: "",
      email: "",
      phoneNumber: "",
      drivingLicense: "",
      address: "",
    },
  })

  // Fetch license image when driving license number changes
  useEffect(() => {
    const fetchLicenseImage = async () => {
      if (formData.userDetails.drivingLicense) {
        try {
          const response = await fetch(`/api/licenses/${formData.userDetails.drivingLicense}`)
          const data = await response.json()
          if (data.imageUrl) {
            setLicenseImageUrl(data.imageUrl)
          }
        } catch (error) {
          console.error("Error fetching license image:", error)
        }
      } else {
        setLicenseImageUrl(null)
      }
    }

    fetchLicenseImage()
  }, [formData.userDetails.drivingLicense])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prevState) => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    setDropOffPhotos((prev) => [...prev, ...files])
  }

  const removePhoto = (index) => {
    setDropOffPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleEntryMethodSelect = (method) => {
    setEntryMethod(method)
    if (method === "qr") {
      setShowQRScanner(true)
    }
  }

  const handleQRResult = async (result) => {
    try {
      console.log("Raw QR Data:", result)
      setIsSubmitting(true)
      
      // Call the API with the QR code data
      const response = await fetch("http://localhost:5000/api/admin-dropoff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dropOffString: result }),
      })
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }
      
      const data = await response.json()
      console.log("API Response:", data)

      console.log("data.user", data.data.user)
      
      // Store the booking ID from the API response
      setBookingId(result) // Correctly set the extracted value
      
      // Update form with the data from API
      setFormData((prevState) => ({
        ...prevState,
        bikeId: data.data.vehicle?.numberPlate || "",
        userDetails: {
          name: data.data.user?.name || "",
          email: data.data.user?.email || "",
          phoneNumber: data.data.user?.phone || "",
          drivingLicense: data.data.user?.drivingLicense?.number || "",
          bookingId: data.data.booking?.id || "",
          address: "", // The API doesn't seem to provide address
        },
      }))
  
      setShowQRScanner(false)
      toast.success("QR Code successfully scanned and details retrieved!")
    } catch (error) {
      console.error("Error processing QR code:", error)
      toast.error("Error retrieving details from QR code. Please try again or enter details manually.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // New function to handle manual verification checkbox
  const handleVerificationChange = (e) => {
    setIsVerified(e.target.checked)
    if (e.target.checked) {
      toast.success("Identity manually verified!")
    } else {
      toast.error("Identity verification removed")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.userDetails.drivingLicense) {
      toast.error("Driving license number is required")
      return
    }

    if (!isVerified) {
      toast.error("Please verify user's identity against driving license photo")
      return
    }
    
    if (!bookingId) {
      console.log()
      toast.error("Booking ID is required")
      return
    }

    setIsSubmitting(true)

    try {
      // Send confirmation to the admin-dropoff-confirm endpoint
      const confirmResponse = await fetch("http://localhost:5000/api/admin-dropoff-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId: bookingId }),
      })

      const confirmTextResponse = await confirmResponse.text()
      
      if (!confirmResponse.ok) {
        console.error("Error confirming drop off:", confirmTextResponse)
        toast.error("Failed to confirm e-bike drop off. Please try again.")
        return
      }

      toast.success("E-Bike drop off successfully confirmed!")
      
      // Reset form
      setFormData({
        bikeId: "",
        userDetails: {
          name: "",
          email: "",
          phoneNumber: "",
          drivingLicense: "",
          address: "",
        },
      })
      setDropOffPhotos([])
      setIsVerified(false)
      setLicenseImageUrl(null)
      setEntryMethod(null)
      setBookingId("") // Reset booking ID
      
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error(`An error occurred: ${error.message || "Failed to process drop off"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // New function to handle manual booking ID input
  const handleBookingIdChange = (e) => {
    setBookingId(e.target.value)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">E-Bike Drop Off Process</h2>

      {/* Entry Method Selection */}
      {!entryMethod && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => handleEntryMethodSelect("qr")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Scan QR Code
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => handleEntryMethodSelect("manual")}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                QR scanning not working? Enter details manually
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      {entryMethod && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Scanned Data or Manual Entry Fields */}
          {entryMethod === "qr" ? (
            // Display scanned data in a read-only format
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold mb-4">Scanned Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Full Name</label>
                  <p className="mt-1 text-gray-900">{formData.userDetails.name || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email Address</label>
                  <p className="mt-1 text-gray-900">{formData.userDetails.email || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                  <p className="mt-1 text-gray-900">{formData.userDetails.phoneNumber || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Driving License</label>
                  <p className="mt-1 text-gray-900">{formData.userDetails.drivingLicense || "Not provided"}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600">Address</label>
                  <p className="mt-1 text-gray-900">{formData.userDetails.address || "Not provided"}</p>
                </div>
                {formData.bikeId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Bike ID</label>
                    <p className="mt-1 text-gray-900">{formData.bikeId}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-600">Booking ID</label>
                  <p className="mt-1 text-gray-900">{bookingId || "Not available"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEntryMethod(null)}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                ← Change Entry Method
              </button>
            </div>
          ) : (
            // Manual entry fields
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Enter Details Manually</h3>
                <button
                  type="button"
                  onClick={() => setEntryMethod(null)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ← Change Entry Method
                </button>
              </div>

              {/* Required Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="userDetails.name"
                    value={formData.userDetails.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="userDetails.email"
                    value={formData.userDetails.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="userDetails.phoneNumber"
                    value={formData.userDetails.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    Driving License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="userDetails.drivingLicense"
                    value={formData.userDetails.drivingLicense}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">
                    Bike ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bikeId"
                    value={formData.bikeId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                {/* Manual Booking ID input field */}
                <div>
                  <label className="block mb-1 font-medium">
                    Booking ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bookingId"
                    value={bookingId}
                    onChange={handleBookingIdChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* License Image Display */}
          {licenseImageUrl && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Driving License Image</h3>
              <img src={licenseImageUrl} alt="Driving License" className="w-full max-h-48 object-contain rounded-lg" />
            </div>
          )}

          {/* Optional Fields */}
          <div className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">Address (Optional)</label>
              <textarea
                name="userDetails.address"
                value={formData.userDetails.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Drop Off Photos (Optional)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {dropOffPhotos.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {dropOffPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Drop off photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Manual Verification Checkbox */}
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <h3 className="text-lg font-semibold mb-2">Identity Verification</h3>
            <p className="mb-4 text-gray-600">Please manually verify the user's face against their driving license photo.</p>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="verificationCheckbox"
                checked={isVerified}
                onChange={handleVerificationChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                disabled={!formData.userDetails.drivingLicense}
              />
              <label htmlFor="verificationCheckbox" className="ml-2 block text-sm font-medium text-gray-700">
                I confirm that I have verified the user's face matches their driving license photo
              </label>
            </div>
            
            {!formData.userDetails.drivingLicense && (
              <div className="mt-2 text-yellow-700 text-sm">
                <p>Please enter driving license details to enable verification</p>
              </div>
            )}
          </div>

          {/* Validation for Booking ID */}
          {entryMethod === "manual" && !bookingId && (
            <div className="mt-2 text-red-600 text-sm">
              <p>Please enter a booking ID to complete the Drop Off</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isVerified || isSubmitting || (!bookingId && entryMethod === "manual")}
            className={`w-full py-3 rounded-lg transition duration-200 ${
              isVerified && !isSubmitting && (bookingId || entryMethod !== "manual")
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Confirm Drop Off"}
          </button>
        </form>
      )}

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <div className="mb-2 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Scan QR Code</h3>
              <button 
                onClick={() => setShowQRScanner(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <QRScanner onResult={handleQRResult} onClose={() => setShowQRScanner(false)} />
            {isSubmitting && (
              <div className="text-center mt-2">
                <p>Retrieving user details...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EBikeDropOffForm