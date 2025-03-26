"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { MapPin, BatteryFull, DollarSign, ChevronLeft, Car, Zap, Clock, AlertCircle, Loader } from "lucide-react"

function StationVehiclesPage() {
  const { stationId } = useParams()
  const [station, setStation] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedVehicleType, setSelectedVehicleType] = useState("all")

  useEffect(() => {
    const fetchStationDetails = async () => {
      setLoading(true)
      try {
        const response = await fetch(`http://localhost:5000/api/locations/${stationId}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch station: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Received station data:", data)

        if (data.success) {
          setStation(data.data)
          setVehicles(data.data.availableVehicles || [])
        } else {
          throw new Error(data.message || "Failed to fetch station details")
        }
      } catch (err) {
        console.error("Error fetching station details:", err)
        setError(err.message)

        // Mock data for demo purposes
        setStation({
          _id: stationId,
          name: "Downtown EV Station",
          address: "123 Main Street, Downtown",
          description:
            "Our flagship station located in the heart of downtown with 24/7 service and multiple charging options.",
          openingHours: "24/7",
          amenities: ["Restrooms", "Cafe", "Waiting Area", "Wi-Fi"],
        })

        setVehicles([
          {
            _id: "101",
            name: "Tesla Model 3",
            type: "sedan",
            image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800",
            pricePerHour: 25,
            chargingStatus: { level: 90 },
            numberPlate: "EV-1234",
          },
          {
            _id: "102",
            name: "Nissan Leaf",
            type: "hatchback",
            image: "https://images.unsplash.com/photo-1593055497705-59a4c0ec5a6c?auto=format&fit=crop&w=800",
            pricePerHour: 18,
            chargingStatus: { level: 75 },
            numberPlate: "EV-5678",
          },
          {
            _id: "103",
            name: "Rivian R1S",
            type: "suv",
            image: "https://images.unsplash.com/photo-1631895592799-91aaa2d5a649?auto=format&fit=crop&w=800",
            pricePerHour: 35,
            chargingStatus: { level: 85 },
            numberPlate: "EV-9012",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchStationDetails()
  }, [stationId])

  const filteredVehicles =
    selectedVehicleType === "all" ? vehicles : vehicles.filter((vehicle) => vehicle.type === selectedVehicleType)

  const vehicleTypes = ["all", ...new Set(vehicles.map((v) => v.type).filter(Boolean))]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center items-center">
        <div className="text-center">
          <Loader className="h-10 w-10 text-green-600 animate-spin mx-auto mb-4" />
          <div className="text-xl text-gray-600">Loading station details...</div>
        </div>
      </div>
    )
  }

  if (error && !station) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="text-center bg-red-50 p-8 rounded-xl max-w-2xl mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error loading station</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            to="/locations"
            className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Locations
          </Link>
        </div>
      </div>
    )
  }

  if (!station) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="text-center bg-red-50 p-8 rounded-xl max-w-2xl mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Station not found</h2>
          <Link
            to="/locations"
            className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Locations
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <Link to="/locations" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to Locations
      </Link>

      {/* Station Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={
                station.image ||
                "../public/Nirma.jpeg"
              }
              alt={station.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-6 md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{station.name}</h1>
            <div className="flex items-start mb-4">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-gray-600">{station.address}</p>
            </div>

            <p className="text-gray-700 mb-4">{station.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-gray-700 mb-1">
                  <Clock className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-sm font-medium">Hours</span>
                </div>
                <p className="text-gray-600 text-sm">{station.openingHours || "24/7"}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-gray-700 mb-1">
                  <Car className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-sm font-medium">Vehicles</span>
                </div>
                <p className="text-gray-600 text-sm">{vehicles.length} available</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-gray-700 mb-1">
                  <Zap className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-sm font-medium">Charging</span>
                </div>
                <p className="text-gray-600 text-sm">{station.chargingPorts || "4"} ports</p>
              </div>

              {station.amenities && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-gray-700 mb-1">
                    <span className="text-sm font-medium">Amenities</span>
                  </div>
                  <p className="text-gray-600 text-sm truncate">
                    {station.amenities.slice(0, 2).join(", ")}
                    {station.amenities.length > 2 ? " & more" : ""}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Type Filter */}
      {vehicles.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Available Vehicles</h2>
          <div className="flex flex-wrap gap-2">
          {vehicleTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedVehicleType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedVehicleType === type
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type === 'all' ? 'All' : (type && `${type.charAt(0).toUpperCase() + type.slice(1)}`) || 'Unknown'}
            </button>
          ))}
          </div>
        </div>
      )}

      {/* Vehicles Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="bg-yellow-50 p-6 rounded-xl text-center">
          <AlertCircle className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-1">No vehicles available</h3>
          <p className="text-yellow-700">
            There are currently no vehicles available at this station. Please check back later or try another station.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => {
            // Calculate actual range based on battery level
            const RANGE_MULTIPLIER = 3 // 1% multiplier
            const actualRange = Math.round(vehicle.chargingStatus.level * RANGE_MULTIPLIER)

            return (
              <div
                key={vehicle._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={
                      vehicle.image ||
                      `../public/${vehicle.numberPlate}.jpeg`
                    }
                    alt={vehicle.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {vehicle.numberPlate}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-3">{vehicle.name}</h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-700">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        <span className="font-medium">${vehicle.pricePerHour}/hour</span>
                      </div>
                      <div className="text-sm bg-gray-100 px-2 py-1 rounded-lg">
                        {vehicle.type ? `${vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}` : 'Unknown'}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center text-gray-700 mb-1">
                        <BatteryFull className="h-4 w-4 mr-1 text-green-600" />
                        <span>Battery: {vehicle.chargingStatus.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            vehicle.chargingStatus.level > 70
                              ? "bg-green-600"
                              : vehicle.chargingStatus.level > 30
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${vehicle.chargingStatus.level}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Range: ~{actualRange}km</p>
                    </div>
                  </div>

                  <Link
                    to={`/book/${vehicle._id}`}
                    className="block w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StationVehiclesPage

