"use client"

import { useState, useEffect } from "react"
import { Wallet, Gift, Car, User, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import ChatbotButton from "../components/ChatbotButton"
import ChatbotWindow from "../components/ChatbotWindow"

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("vehicles")
  const [showChat, setShowChat] = useState(false)
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    memberSince: "",
    rewardPoints: 0,
    activeBookings: [],
    bookingHistory: [],
  })

  // Get user data from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const bookingHistoryData = user.bookingHistory || [
      {
        id: "B001",
        vehicle: "Tesla Model 3",
        date: "2023-03-15",
        duration: "3 hours",
        amount: "$150",
      },
    ]
    
    setUserData({
      name: user.name || "Guest User",
      email: user.email || "",
      phone: user.phone || "",
      memberSince: user.memberSince || "New Member",
      rewardPoints: user.rewardPoints || 0,
      activeBookings: user.activeBookings || [],
      bookingHistory: bookingHistoryData,
    })
  }, [])

  // Handle authentication changes
  useEffect(() => {
    // Function to handle auth state changes
    const handleAuthChange = () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      
      setUserData(prevData => ({
        ...prevData,
        name: user.name || "Guest User",
        email: user.email || "",
        phone: user.phone || "",
        memberSince: user.memberSince || "New Member",
        rewardPoints: user.rewardPoints || 0,
      }))
    }

    // Listen for auth changes
    window.addEventListener("authChange", handleAuthChange)
    
    // Clean up event listener
    return () => {
      window.removeEventListener("authChange", handleAuthChange)
    }
  }, [])

  const tabs = [
    { id: "vehicles", name: "Find Vehicles", icon: Car },
    { id: "account", name: "Account Info", icon: User },
    { id: "rewards", name: "Rewards & Offers", icon: Gift },
    { id: "wallet", name: "Wallet", icon: Wallet },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id ? "bg-green-600 text-white" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === "vehicles" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Find Available Vehicles</h2>
                <p className="text-gray-600 mb-6">Find and book electric vehicles from our stations around the city.</p>
                <Link
                  to="/locations"
                  className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Browse Nearby Stations
                </Link>
              </div>

              {userData.activeBookings.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">Your Active Bookings</h3>
                  {/* Active bookings would be listed here */}
                </div>
              ) : null}

              {userData.bookingHistory.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Booking ID
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vehicle
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {userData.bookingHistory.map((booking) => (
                          <tr key={booking.id}>
                            <td className="px-4 py-2 whitespace-nowrap">{booking.id}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{booking.vehicle}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{booking.date}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{booking.duration}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{booking.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "account" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-lg">{userData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-lg">{userData.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="text-lg">{userData.memberSince}</p>
                  </div>
                </div>
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          )}

          {activeTab === "rewards" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Rewards & Offers</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-green-700 font-medium">Your Reward Points</p>
                  <p className="text-3xl font-bold text-green-600">{userData.rewardPoints}</p>
                </div>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Redeem Points
                </button>
              </div>
              <h3 className="text-xl font-semibold mb-3">Current Offers</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="font-medium">Weekend Special: 20% Off</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Get 20% off on all weekend bookings. Valid until the end of the month.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="font-medium">Refer a Friend</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Earn 100 points for each friend who signs up and completes their first booking.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "wallet" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Wallet</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-blue-700 font-medium">Your Balance</p>
                  <p className="text-3xl font-bold text-blue-600">${userData.walletBalance || "0.00"}</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add Money
                </button>
              </div>
              <h3 className="text-xl font-semibold mb-3">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userData.transactions && userData.transactions.length > 0 ? (
                      userData.transactions.map((transaction, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap">{transaction.date}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{transaction.description}</td>
                          <td className={`px-4 py-2 whitespace-nowrap ${transaction.amount.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                            {transaction.amount}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-4 py-2 whitespace-nowrap">2023-03-15</td>
                        <td className="px-4 py-2 whitespace-nowrap">Payment for Tesla Model 3</td>
                        <td className="px-4 py-2 whitespace-nowrap text-red-600">-$150.00</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chatbot */}
      <ChatbotButton onClick={() => setShowChat(true)} />
      {showChat && <ChatbotWindow isAdmin={false} onClose={() => setShowChat(false)} />}
    </div>
  )
}

export default UserDashboard