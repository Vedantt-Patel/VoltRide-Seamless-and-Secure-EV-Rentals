"use client"

import { useState, useEffect } from "react"
import {
  StationOverview,
  ChargingPorts,
  VehicleFleet,
  BookingSummary,
  RevenueSummary,
  MaintenanceAlerts,
  NotificationPanel,
} from "../components/dashboard"
import { Sidebar, Header } from "../components/common"

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute("data-theme", "dark")
    } else {
      document.body.removeAttribute("data-theme")
    }
  }, [isDarkMode])

  return (
    <div className="dashboard-container">
      <div className={`app ${isDarkMode ? "dark" : "light"}`}>
        <Sidebar />
        <div className="main-content">
          <Header toggleTheme={() => setIsDarkMode(!isDarkMode)} isDarkMode={isDarkMode} />
          <div className="dashboard-grid">
            <StationOverview />
            <div className="dashboard-row">
              <ChargingPorts />
              <VehicleFleet />
            </div>
            <div className="dashboard-row">
              <BookingSummary />
              <RevenueSummary />
            </div>
            <div className="dashboard-row">
              <MaintenanceAlerts />
              <NotificationPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

