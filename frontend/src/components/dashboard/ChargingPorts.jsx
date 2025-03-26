import { CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

const ChargingPorts = () => {
  const ports = [
    {
      id: "PORT-001",
      type: "Fast",
      status: "Available",
      lastUsage: "2024-03-15 14:30",
      powerOutput: 150,
      utilization: 85,
    },
    {
      id: "PORT-002",
      type: "Slow",
      status: "Occupied",
      lastUsage: "2024-03-15 15:45",
      powerOutput: 50,
      utilization: 60,
    },
    {
      id: "PORT-003",
      type: "Fast",
      status: "Maintenance",
      lastUsage: "2024-03-15 12:15",
      powerOutput: 150,
      utilization: 0,
    },
  ]

  const getStatusColor = (status) => {
    const colors = {
      Available: "#4CAF50",
      Occupied: "#FFA500",
      Maintenance: "#f44336",
    }
    return colors[status] || "#999"
  }

  return (
    <div className="charging-ports card">
      <h2>Charging Ports Status</h2>
      <div className="ports-grid">
        {ports.map((port) => (
          <div key={port.id} className="port-card">
            <div className="port-header">
              <h3>{port.id}</h3>
              <span className={`port-type ${port.type.toLowerCase()}`}>{port.type}</span>
            </div>

            <div className="port-stats">
              <div className="utilization-chart">
                <CircularProgressbar
                  value={port.utilization}
                  text={`${port.utilization}%`}
                  styles={{
                    path: { stroke: getStatusColor(port.status) },
                  }}
                />
              </div>

              <div className="port-details">
                <p>
                  <strong>Status:</strong>
                  <span style={{ color: getStatusColor(port.status) }}>{port.status}</span>
                </p>
                <p>
                  <strong>Power Output:</strong> {port.powerOutput}kW
                </p>
                <p>
                  <strong>Last Usage:</strong>
                  <br />
                  {new Date(port.lastUsage).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChargingPorts

