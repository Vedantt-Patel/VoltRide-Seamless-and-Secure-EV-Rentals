import {
  FaHome,
  FaChargingStation,
  FaCar,
  FaCalendarAlt,
  FaChartLine,
  FaTools,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa"

const Sidebar = () => {
  const menuItems = [
    { icon: <FaHome />, label: "Dashboard", active: true },
    { icon: <FaChargingStation />, label: "Charging Stations" },
    { icon: <FaCar />, label: "Vehicles" },
    { icon: <FaCalendarAlt />, label: "Bookings" },
    { icon: <FaChartLine />, label: "Analytics" },
    { icon: <FaTools />, label: "Maintenance" },
    { icon: <FaCog />, label: "Settings" },
  ]

  return (
    <div className="sidebar">
      <div className="logo">
        <h2>EV Admin</h2>
      </div>

      <nav className="sidebar-menu">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className={item.active ? "active" : ""}>
              <a href="#">
                {item.icon}
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar

