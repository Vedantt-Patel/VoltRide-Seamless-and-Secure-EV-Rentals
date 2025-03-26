import { FaBell, FaBatteryQuarter, FaUserClock, FaMoneyBillWave } from "react-icons/fa"

const NotificationPanel = () => {
  const notifications = [
    {
      id: 1,
      type: "alert",
      message: "Vehicle VEH-004 battery below 15%",
      time: "10 minutes ago",
      icon: <FaBatteryQuarter />,
    },
    {
      id: 2,
      type: "booking",
      message: "New booking #BK-003 confirmed",
      time: "25 minutes ago",
      icon: <FaUserClock />,
    },
    {
      id: 3,
      type: "payment",
      message: "Payment received for booking #BK-002",
      time: "1 hour ago",
      icon: <FaMoneyBillWave />,
    },
  ]

  const getNotificationColor = (type) => {
    const colors = {
      alert: "#f44336",
      booking: "#2196F3",
      payment: "#4CAF50",
    }
    return colors[type] || "#999"
  }

  return (
    <div className="notification-panel card">
      <div className="notification-header">
        <h2>Notifications</h2>
        <span className="notification-count">{notifications.length}</span>
      </div>

      <div className="notifications-list">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-item">
            <div className="notification-icon" style={{ backgroundColor: getNotificationColor(notification.type) }}>
              {notification.icon}
            </div>
            <div className="notification-content">
              <p>{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="view-all-btn">
        View All Notifications
        <FaBell />
      </button>
    </div>
  )
}

export default NotificationPanel

