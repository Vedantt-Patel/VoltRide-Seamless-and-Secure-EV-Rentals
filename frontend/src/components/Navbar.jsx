"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { Car, UserCircle, MapPin, Menu, X, LogOut } from "lucide-react"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [user, setUser] = useState(null)
  const location = useLocation()
  const dropdownRef = useRef(null)

  // Function to check user authentication status
  const checkUserAuth = () => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    // Check if user is logged in
    checkUserAuth()

    // Add event listener for scroll
    window.addEventListener("scroll", handleScroll)
    
    // Add storage event listener to detect changes to localStorage
    window.addEventListener("storage", checkUserAuth)
    
    // Create a custom event listener for auth changes
    window.addEventListener("authChange", checkUserAuth)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("storage", checkUserAuth)
      window.removeEventListener("authChange", checkUserAuth)
    }
  }, [])

  // Re-check auth status on location/route changes
  useEffect(() => {
    checkUserAuth()
  }, [location])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setIsDropdownOpen(false)
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("authChange"))
    window.location.href = "/"
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-md"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-green-600 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">EV Rentals</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/locations"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${isActive("/locations") ? "bg-green-50 text-green-600" : "text-gray-700 hover:text-green-600 hover:bg-green-50"}`}
            >
              <MapPin className="h-5 w-5" />
              <span>Locations</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg transition-colors ${isActive("/dashboard") ? "bg-green-50 text-green-600" : "text-gray-700 hover:text-green-600 hover:bg-green-50"}`}
                >
                  Dashboard
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button 
                    className="flex items-center space-x-1 text-gray-700 hover:text-green-600"
                    onClick={toggleDropdown}
                  >
                    <UserCircle className="h-6 w-6" />
                    <span>{user.name?.split(" ")[0] || "User"}</span>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        My Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsDropdownOpen(false)
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <UserCircle className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/locations"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${isActive("/locations") ? "bg-green-50 text-green-600" : "text-gray-700 hover:bg-green-50 hover:text-green-600"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <MapPin className="h-5 w-5" />
              <span>Locations</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`block px-3 py-2 rounded-lg ${isActive("/dashboard") ? "bg-green-50 text-green-600" : "text-gray-700 hover:bg-green-50 hover:text-green-600"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserCircle className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar