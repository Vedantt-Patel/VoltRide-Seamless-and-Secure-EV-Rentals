import { BsBatteryHalf, BsSpeedometer } from "react-icons/bs"
import { FaCar } from "react-icons/fa"

const VehicleFleet = () => {
  const vehicles = [
    {
      id: "VEH-001",
      type: "Tesla Model 3",
      batteryLevel: 85,
      status: "Available",
      distanceTraveled: 12500,
      lastMaintenance: "2024-02-15",
    },
    {
      id: "VEH-002",
      type: "Nissan Leaf",
      batteryLevel: 45,
      status: "In Use",
      distanceTraveled: 15800,
      lastMaintenance: "2024-02-20",
    },
    {
      id: "VEH-003",
      type: "BMW i3",
      batteryLevel: 20,
      status: "Maintenance",
      distanceTraveled: 18200,
      lastMaintenance: "2024-03-10",
    },
  ]

  const getBatteryColor = (level) => {
    if (level > 70) return "#4CAF50"
    if (level > 30) return "#FFA500"
    return "#f44336"
  }

  return (
    <div className="vehicle-fleet card">
      <h2>Vehicle Fleet Overview</h2>
      <div className="vehicles-grid">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="vehicle-card">
            <div className="vehicle-header">
              <div className="vehicle-icon">
                <FaCar size={24} />
              </div>
              <div>
                <h3>{vehicle.type}</h3>
                <span className="vehicle-id">{vehicle.id}</span>
              </div>
            </div>

            <div className="vehicle-stats">
              <div className="battery-indicator">
                <BsBatteryHalf size={32} color={getBatteryColor(vehicle.batteryLevel)} />
                <span style={{ color: getBatteryColor(vehicle.batteryLevel) }}>{vehicle.batteryLevel}%</span>
              </div>

              <div className="vehicle-details">
                <div className="detail-item">
                  <BsSpeedometer />
                  <span>{vehicle.distanceTraveled.toLocaleString()} km</span>
                </div>
                <p className={`status ${vehicle.status.toLowerCase()}`}>{vehicle.status}</p>
                <p className="maintenance-date">
                  Last Maintenance: {new Date(vehicle.lastMaintenance).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VehicleFleet

