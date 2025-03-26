import axios from "axios"

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials)
    return response.data
  },
  register: async (userData) => {
    const response = await api.post("/auth/register", userData)
    return response.data
  },
  verifyToken: async () => {
    const response = await api.get("/auth/verify")
    return response.data
  },
}

// Booking API
export const bookingAPI = {
  createBooking: async (bookingData) => {
    const response = await api.post("/bookings", bookingData)
    return response.data
  },
  getBookingById: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`)
    return response.data
  },
  getUserBookings: async () => {
    const response = await api.get("/bookings/user")
    return response.data
  },
  cancelBooking: async (bookingId) => {
    const response = await api.post(`/bookings/${bookingId}/cancel`)
    return response.data
  },
}

// Vehicle API
export const vehicleAPI = {
  getAllVehicles: async () => {
    const response = await api.get("/vehicles")
    return response.data
  },
  getVehicleById: async (vehicleId) => {
    const response = await api.get(`/vehicles/${vehicleId}`)
    return response.data
  },
  getAvailableVehicles: async (params) => {
    const response = await api.get("/vehicles/available", { params })
    return response.data
  },
}

// User API
export const userAPI = {
  getUserProfile: async () => {
    const response = await api.get("/users/profile")
    return response.data
  },
  updateUserProfile: async (userData) => {
    const response = await api.put("/users/profile", userData)
    return response.data
  },
  updateUserPassword: async (passwordData) => {
    const response = await api.put("/users/password", passwordData)
    return response.data
  },
}

// Location API
export const locationAPI = {
  getNearbyStations: async (params) => {
    const response = await api.get("/locations/nearby", { params })
    return response.data
  },
}

// Admin API
export const adminAPI = {
  verifyQRCode: async (qrCode) => {
    const response = await api.post("/admin/verify-qr", { qrCode })
    return response.data
  },
  handleVehicleReturn: async (data) => {
    const formData = new FormData()
    formData.append("bookingId", data.bookingId)
    formData.append("damageReport", JSON.stringify(data.damageReport))
    formData.append("notes", data.notes)
    data.returnImages.forEach((image) => {
      formData.append("returnImages", image)
    })

    const response = await api.post("/admin/return", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
  findBookingByUserDetails: async (data) => {
    const response = await api.post("/admin/find-booking", data)
    return response.data
  },
}

// Export all APIs
export { api }

