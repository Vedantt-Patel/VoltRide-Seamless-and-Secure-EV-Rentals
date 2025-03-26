"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
// Import icons
import { FaCarAlt, FaChargingStation, FaMoneyBillWave, FaTools, FaCalendarCheck } from "react-icons/fa"
// Import chart components
import { Bar, Pie } from "react-chartjs-2"
// Add these imports at the top of your file
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"

// Register the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const AdminDashboard = () => {
  const [showChat, setShowChat] = useState(false)

  // Mock data for demonstration
  const stationData = {
    name: "Downtown EV Station",
    id: "STA-001",
    location: "123 Main Street, City",
    availablePorts: 8,
    totalPorts: 12,
    availableVehicles: 15,
    totalVehicles: 25,
    hours: "7:00 AM - 10:00 PM",
    status: "Open",
  }

  const chargingPorts = [
    { id: "CP-001", type: "Fast", status: "Available", lastUsage: "2023-07-15 14:30", powerOutput: 50 },
    { id: "CP-002", type: "Slow", status: "Occupied", lastUsage: "2023-07-15 16:45", powerOutput: 22 },
    { id: "CP-003", type: "Fast", status: "Maintenance", lastUsage: "2023-07-14 09:15", powerOutput: 50 },
    { id: "CP-004", type: "Slow", status: "Available", lastUsage: "2023-07-15 11:20", powerOutput: 22 },
  ]

  const vehicles = [
    { id: "EV-001", type: "Sedan", batteryLevel: 85, status: "Available", distance: 1250 },
    { id: "EV-002", type: "SUV", batteryLevel: 65, status: "In Use", distance: 2340 },
    { id: "EV-003", type: "Compact", batteryLevel: 30, status: "Available", distance: 3120 },
    { id: "EV-004", type: "Sedan", batteryLevel: 90, status: "Maintenance", distance: 4500 },
  ]

  const bookings = [
    {
      id: "BK-001",
      user: "John Doe",
      contact: "555-1234",
      vehicle: "EV-002",
      start: "2023-07-15 09:00",
      end: "2023-07-15 17:00",
      duration: "8h",
      payment: "Paid",
    },
    {
      id: "BK-002",
      user: "Jane Smith",
      contact: "555-5678",
      vehicle: "EV-005",
      start: "2023-07-15 10:30",
      end: "2023-07-15 14:30",
      duration: "4h",
      payment: "Pending",
    },
    {
      id: "BK-003",
      user: "Bob Johnson",
      contact: "555-9012",
      vehicle: "EV-008",
      start: "2023-07-16 08:00",
      end: "2023-07-16 18:00",
      duration: "10h",
      payment: "Paid",
    },
  ]

  const revenue = {
    today: 1250,
    weekly: 8750,
    monthly: 32500,
    pending: 750,
    topPaymentModes: [
      { mode: "Credit Card", percentage: 65 },
      { mode: "Mobile Payment", percentage: 25 },
      { mode: "Cash", percentage: 10 },
    ],
    refunds: 2,
  }

  const maintenanceAlerts = [
    { type: "Port", id: "CP-003", issue: "Connector damaged", priority: "High" },
    { type: "Vehicle", id: "EV-004", issue: "Brake system check", priority: "Medium" },
    { type: "Port", id: "CP-008", issue: "Scheduled maintenance", priority: "Low" },
  ]

  const notifications = [
    { type: "alert", message: "EV-007 battery below 20%", time: "10 min ago" },
    { type: "booking", message: "New booking: BK-004", time: "30 min ago" },
    { type: "payment", message: "Payment received for BK-002", time: "1 hour ago" },
    { type: "maintenance", message: "CP-003 maintenance completed", time: "2 hours ago" },
  ]

  // Chart data
  const revenueChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Daily Revenue ($)",
        data: [1200, 1500, 1000, 1800, 1250, 2000, 1750],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  }

  const paymentChartData = {
    labels: ["Credit Card", "Mobile Payment", "Cash"],
    datasets: [
      {
        label: "Payment Methods",
        data: [65, 25, 10],
        backgroundColor: ["rgba(54, 162, 235, 0.7)", "rgba(75, 192, 192, 0.7)", "rgba(255, 206, 86, 0.7)"],
        borderWidth: 1,
      },
    ],
  }

  // Status badge component
  const StatusBadge = ({ status }) => {
    let color
    switch (status.toLowerCase()) {
      case "available":
        color = "bg-green-500"
        break
      case "occupied":
      case "in use":
        color = "bg-blue-500"
        break
      case "maintenance":
        color = "bg-yellow-500"
        break
      case "paid":
        color = "bg-green-500"
        break
      case "pending":
        color = "bg-yellow-500"
        break
      default:
        color = "bg-gray-500"
    }
    return <span className={`${color} text-white text-xs px-2 py-1 rounded-full`}>{status}</span>
  }

  // Battery level component
  const BatteryLevel = ({ level }) => {
    let color
    if (level >= 70) color = "bg-green-500"
    else if (level >= 30) color = "bg-yellow-500"
    else color = "bg-red-500"

    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${level}%` }}></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      {/* Station Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
          <FaChargingStation className="mr-2" /> Station Overview
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="font-medium text-gray-600">Station Info</h3>
            <p className="text-xl font-bold">{stationData.name}</p>
            <p className="text-sm text-gray-500">ID: {stationData.id}</p>
            <p className="text-sm text-gray-500">{stationData.location}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-600">Charging Ports</h3>
            <p className="text-xl font-bold">
              {stationData.availablePorts} / {stationData.totalPorts}
            </p>
            <p className="text-sm text-gray-500">Available / Total</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-600">Vehicles</h3>
            <p className="text-xl font-bold">
              {stationData.availableVehicles} / {stationData.totalVehicles}
            </p>
            <p className="text-sm text-gray-500">Available / Total</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-600">Station Status</h3>
            <p className="text-xl font-bold">{stationData.status}</p>
            <p className="text-sm text-gray-500">{stationData.hours}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* E-Bike Pickup Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">E-Bike Pickup</h2>
          <p className="text-gray-600 mb-4">Process new e-bike pickups and verify user information</p>
          <Link
            to="/admin/pickup"
            className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Start Pickup Process
          </Link>
        </div>

        {/* E-Bike Drop-off Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">E-Bike Drop-off</h2>
          <p className="text-gray-600 mb-4">Process e-bike returns and check vehicle condition</p>
          <Link
            to="/admin/dropoff"
            className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Start Drop-off Process
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Charging Port Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaChargingStation className="mr-2" /> Charging Port Status
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Port ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Power (kW)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chargingPorts.map((port, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{port.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{port.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <StatusBadge status={port.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{port.lastUsage}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{port.powerOutput}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicle Fleet Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaCarAlt className="mr-2" /> Vehicle Fleet Overview
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Battery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distance (km)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.map((vehicle, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="mr-2">{vehicle.batteryLevel}%</span>
                        <BatteryLevel level={vehicle.batteryLevel} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <StatusBadge status={vehicle.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.distance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Recent Bookings Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaCalendarCheck className="mr-2" /> Recent Bookings
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <p>{booking.user}</p>
                        <p className="text-xs text-gray-400">{booking.contact}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.vehicle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <StatusBadge status={booking.payment} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaMoneyBillWave className="mr-2" /> Revenue Summary
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-xl font-bold">${revenue.today}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Weekly</p>
              <p className="text-xl font-bold">${revenue.weekly}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Monthly</p>
              <p className="text-xl font-bold">${revenue.monthly}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-600 mb-2">Weekly Revenue</h3>
              <div className="h-48">
                <Bar
                  data={revenueChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-600 mb-2">Payment Methods</h3>
              <div className="h-48">
                <Pie
                  data={paymentChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        display: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Maintenance Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaTools className="mr-2" /> Maintenance Alerts
          </h2>
          <div className="space-y-4">
            {maintenanceAlerts.map((alert, index) => (
              <div key={index} className="border-l-4 border-yellow-500 pl-4 py-2">
                <div className="flex justify-between">
                  <p className="font-medium">
                    {alert.type} {alert.id}
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      alert.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : alert.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {alert.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{alert.issue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { AdminDashboard }

