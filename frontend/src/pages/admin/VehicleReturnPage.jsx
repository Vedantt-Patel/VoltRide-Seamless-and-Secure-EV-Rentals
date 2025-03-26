"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Camera, Loader2, XCircle } from "lucide-react"
import { adminAPI } from "../../services/api"
import { toast } from "react-hot-toast"

function VehicleReturnPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [booking, setBooking] = useState(null)
  const [pickupImages, setPickupImages] = useState([])
  const [returnImages, setReturnImages] = useState([])
  const [damageReport, setDamageReport] = useState({
    hasDamages: false,
    notes: "",
    estimatedRepairCost: 0,
  })
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await adminAPI.getBookingForReturn(bookingId)
        setBooking(response.booking)
        setPickupImages(response.pickupImages)
      } catch (err) {
        console.error("Error fetching booking details:", err)
        setError(err.message)
        toast.error("Failed to fetch booking details")
      } finally {
        setLoading(false)
      }
    }

    fetchBookingDetails()
  }, [bookingId])

  const handleImageCapture = (event) => {
    const files = Array.from(event.target.files)
    const newImages = files.map((file) => URL.createObjectURL(file))
    setReturnImages((prev) => [...prev, ...newImages])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await adminAPI.handleVehicleReturn({
        bookingId,
        returnImages,
        damageReport,
        notes,
      })

      toast.success("Vehicle return processed successfully")
      navigate("/admin/dashboard")
    } catch (err) {
      console.error("Error processing vehicle return:", err)
      toast.error("Failed to process vehicle return")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Loading Booking Details</h1>
            <p className="text-gray-600">Please wait while we fetch the booking information</p>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-red-50 p-6 rounded-lg">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Booking</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Process Vehicle Return</h1>

        {/* Customer Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{booking.user.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{booking.user.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-medium">{booking.user.phone}</p>
            </div>
            <div>
              <p className="text-gray-600">Driving License</p>
              <p className="font-medium">{booking.user.drivingLicense}</p>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Make & Model</p>
              <p className="font-medium">
                {booking.vehicle.make} {booking.vehicle.model}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Number Plate</p>
              <p className="font-medium">{booking.vehicle.numberPlate}</p>
            </div>
            <div>
              <p className="text-gray-600">Pickup Date</p>
              <p className="font-medium">{new Date(booking.pickupDate).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Duration</p>
              <p className="font-medium">{booking.duration} hours</p>
            </div>
          </div>
        </div>

        {/* Image Comparison */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Vehicle Condition</h2>

          {/* Pickup Images */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Pickup Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pickupImages.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image} alt={`Pickup ${index + 1}`} className="w-full h-48 object-cover rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Return Images */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Return Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {returnImages.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image} alt={`Return ${index + 1}`} className="w-full h-48 object-cover rounded-lg" />
                  <button
                    onClick={() => setReturnImages((prev) => prev.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-green-500">
                <input type="file" accept="image/*" multiple onChange={handleImageCapture} className="hidden" />
                <Camera className="w-8 h-8 text-gray-400" />
              </label>
            </div>
          </div>

          {/* Damage Report */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Damage Report</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasDamages"
                  checked={damageReport.hasDamages}
                  onChange={(e) =>
                    setDamageReport((prev) => ({
                      ...prev,
                      hasDamages: e.target.checked,
                    }))
                  }
                  className="mr-2"
                />
                <label htmlFor="hasDamages">Vehicle has damages</label>
              </div>
              {damageReport.hasDamages && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Damage Description</label>
                    <textarea
                      value={damageReport.notes}
                      onChange={(e) =>
                        setDamageReport((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Repair Cost</label>
                    <input
                      type="number"
                      value={damageReport.estimatedRepairCost}
                      onChange={(e) =>
                        setDamageReport((prev) => ({
                          ...prev,
                          estimatedRepairCost: Number.parseFloat(e.target.value),
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <h3 className="text-lg font-medium mb-2">Additional Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="3"
              placeholder="Add any additional notes about the vehicle's condition..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading || returnImages.length === 0}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </span>
            ) : (
              "Complete Return"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VehicleReturnPage

