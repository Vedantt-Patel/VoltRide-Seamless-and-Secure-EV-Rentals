import { MapContainer, TileLayer, Marker } from "react-leaflet"

const StationOverview = () => {
  const stationData = {
    name: "EV Station Central",
    id: "STA-001",
    location: {
      address: "123 Main Street, City",
      coordinates: [51.505, -0.09],
    },
    ports: {
      available: 8,
      total: 12,
    },
    vehicles: {
      available: 15,
      total: 20,
    },
    hours: "24/7",
    status: "Open",
  }

  return (
    <div className="station-overview">
      <div className="station-info">
        <div className="station-header">
          <h2>{stationData.name}</h2>
          <span className="station-id">ID: {stationData.id}</span>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <h3>Charging Ports</h3>
            <p>
              <span className="highlight">{stationData.ports.available}</span>/{stationData.ports.total} Available
            </p>
          </div>

          <div className="stat-box">
            <h3>Vehicles</h3>
            <p>
              <span className="highlight">{stationData.vehicles.available}</span>/{stationData.vehicles.total} Available
            </p>
          </div>

          <div className="stat-box">
            <h3>Operating Hours</h3>
            <p>{stationData.hours}</p>
          </div>

          <div className="stat-box">
            <h3>Status</h3>
            <span className={`status-badge ${stationData.status.toLowerCase()}`}>{stationData.status}</span>
          </div>
        </div>
      </div>

      <div className="station-map">
        <MapContainer center={stationData.location.coordinates} zoom={13} style={{ height: "200px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={stationData.location.coordinates} />
        </MapContainer>
      </div>
    </div>
  )
}

export default StationOverview

