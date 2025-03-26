"use client"
import { FaBell, FaUser, FaSearch, FaMoon, FaSun } from "react-icons/fa"

const Header = ({ toggleTheme, isDarkMode }) => {
  return (
    <header className="dashboard-header">
      <div className="search-bar">
        <FaSearch />
        <input type="text" placeholder="Search..." />
      </div>

      <div className="header-actions">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>

        <div className="notification-icon">
          <FaBell />
          <span className="notification-badge">3</span>
        </div>

        <div className="user-profile">
          <div className="user-avatar">
            <FaUser />
          </div>
          <div className="user-info">
            <h4>Admin User</h4>
            <p>Administrator</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

