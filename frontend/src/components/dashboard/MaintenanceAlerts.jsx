import { FaTools, FaExclamationTriangle, FaCalendarAlt } from "react-icons/fa"

const MaintenanceAlerts = () => {
  const alerts = [
    {
      id: 1,
      type: "Port Issue",
      itemId: "PORT-003",
      description: "Charging port not responding",
      priority: "High",
      reportedAt: "2024-03-14T10:30:00",
    },
    {
      id: 2,
      type: "Vehicle Maintenance",
      itemId: "VEH-003",
      description: "Battery replacement needed",
      priority: "Medium",
      reportedAt: "2024-03-15T09:15:00",
    },
    {
      id: 3,
      type: "Scheduled Maintenance",
      itemId: "PORT-001",
      description: "Regular monthly check-up",
      priority: "Low",
      reportedAt: "2024-03-16T14:00:00",
    },
  ]

  const getPriorityColor = (priority) => {
    const colors = {
      High: "#f44336",
      Medium: "#FFA500",
      Low: "#4CAF50",
    }
    return colors[priority] || "#999"
  }

  return (
    <div className="maintenance-alerts card">
      <h2>Maintenance Alerts</h2>
      <div className="alerts-list">
        {alerts.map((alert) => (
          <div key={alert.id} className="alert-card">
            <div className="alert-header">
              <div className="alert-icon">
                {alert.type.includes("Port") ? (
                  <FaTools />
                ) : alert.type.includes("Vehicle") ? (
                  <FaExclamationTriangle />
                ) : (
                  <FaCalendarAlt />
                )}
              </div>
              <div>
                <h3>{alert.type}</h3>
                <span className="alert-id">{alert.itemId}</span>
              </div>
              <span className="priority-badge" style={{ backgroundColor: getPriorityColor(alert.priority) }}>
                {alert.priority}
              </span>
            </div>

            <p className="alert-description">{alert.description}</p>
            <p className="alert-time">Reported: {new Date(alert.reportedAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MaintenanceAlerts

