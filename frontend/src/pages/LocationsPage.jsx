"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MapPin, XCircle, Search, Loader, AlertCircle } from "lucide-react"

function LocationsPage() {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Get user's location and fetch nearby stations
    const fetchNearbyStations = async (position) => {
      try {
        const params = new URLSearchParams({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          radius: 50,
        })

        console.log("Fetching stations with params:", params.toString())

        const response = await fetch(`http://localhost:5000/api/locations/nearby?${params}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          const errorData = await response.text()
          console.error("Server response:", {
            status: response.status,
            statusText: response.statusText,
            data: errorData,
          })
          throw new Error(`Failed to fetch stations: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Received stations:", data)
        setStations(data.data || [])
      } catch (err) {
        console.error("Error fetching stations:", err)
        setError(err.message)

        // For demo purposes, add some mock data if the API fails
        setStations([
          {
            _id: "1",
            name: "Downtown EV Station",
            address: "123 Main Street, Downtown",
            availableVehicles: [{ _id: "101" }, { _id: "102" }],
            image: "https://images.unsplash.com/photo-1593941707882-a56bbc8e7565?auto=format&fit=crop&w=800",
            distance: 1.2,
          },
          {
            _id: "2",
            name: "Westside Charging Hub",
            address: "456 Park Avenue, Westside",
            availableVehicles: [{ _id: "103" }],
            image: "https://images.unsplash.com/photo-1558389186-a9d8c8a97f4d?auto=format&fit=crop&w=800",
            distance: 2.5,
          },
          {
            _id: "3",
            name: "Eastside EV Center",
            address: "789 Broadway, Eastside",
            availableVehicles: [],
            image: "https://images.unsplash.com/photo-1615818733733-8b2f0e3c403a?auto=format&fit=crop&w=800",
            distance: 3.8,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    // Get user location
    navigator.geolocation.getCurrentPosition(
      (position) => fetchNearbyStations(position),
      (err) => {
        setError("Please enable location services to find nearby stations")
        setLoading(false)

        // For demo purposes, add some mock data if geolocation fails
        setStations([
          {
            _id: "1",
            name: "Downtown EV Station",
            address: "123 Main Street, Downtown",
            availableVehicles: [{ _id: "101" }, { _id: "102" }],
            image: "https://images.unsplash.com/photo-1593941707882-a56bbc8e7565?auto=format&fit=crop&w=800",
            distance: 1.2,
          },
          {
            _id: "2",
            name: "Westside Charging Hub",
            address: "456 Park Avenue, Westside",
            availableVehicles: [{ _id: "103" }],
            image: "https://images.unsplash.com/photo-1558389186-a9d8c8a97f4d?auto=format&fit=crop&w=800",
            distance: 2.5,
          },
          {
            _id: "3",
            name: "Eastside EV Center",
            address: "789 Broadway, Eastside",
            availableVehicles: [],
            image: "https://images.unsplash.com/photo-1615818733733-8b2f0e3c403a?auto=format&fit=crop&w=800",
            distance: 3.8,
          },
        ])
      },
    )
  }, [])

  const filteredStations = stations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const StationCard = ({ station }) => {
    const hasVehicles = station.availableVehicles?.length > 0

    return (
      <Link
        to={hasVehicles ? `/station/${station._id}` : "#"}
        key={station._id}
        className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 relative
          ${hasVehicles ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer" : "opacity-75 cursor-not-allowed"}`}
        onClick={(e) => !hasVehicles && e.preventDefault()}
      >
        <div className="relative">
          <img
            src={
              station.image || `../public/${station.name}.jpeg` 
            }
            alt={station.name}
            className={`w-full h-48 object-cover ${!hasVehicles && "grayscale"}`}
          />
          {!hasVehicles && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-center p-4">
                <XCircle className="h-12 w-12 mx-auto mb-2" />
                <p className="font-semibold">No Vehicles Available</p>
              </div>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <span
              className={`text-sm px-3 py-1 rounded-full font-medium ${
                hasVehicles ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {hasVehicles ? `${station.availableVehicles.length} available` : "No vehicles"}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-semibold mb-2">{station.name}</h3>
          <div className="flex items-start space-x-2 text-gray-600 mb-3">
            <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-500" />
            <p>{station.address}</p>
          </div>
          {station.distance && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">{station.distance.toFixed(1)} km away</div>
              {hasVehicles && <div className="text-green-600 font-medium flex items-center">View Vehicles</div>}
            </div>
          )}
        </div>
      </Link>
    )
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nearby EV Rental Stations</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select a station to view available vehicles for rent. We'll show you the closest stations with available EVs.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search stations by name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="h-10 w-10 text-green-600 animate-spin mb-4" />
          <p className="text-gray-600">Finding stations near you...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-2xl mx-auto">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      ) : (
        <>
          {filteredStations.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStations.map((station) => (
                <StationCard key={station._id} station={station} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="text-gray-500 text-xl mb-4">No Stations Found</div>
              <p className="text-gray-400">There are no EV rental stations matching your search criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default LocationsPage

