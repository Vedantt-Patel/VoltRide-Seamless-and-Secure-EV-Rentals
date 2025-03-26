"use client";

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import BookingPage from "./pages/BookingPage";
import LocationsPage from "./pages/LocationsPage";
import StationVehiclesPage from "./pages/StationVehiclesPage";
import EBikePickupForm from "./components/EBikePickupForm";
import EBikeDropOffForm from "./components/EBikeDropOffForm";
import KYC from "./pages/KYC";

function App() {
    // Add scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/locations" element={<LocationsPage />} />
                        <Route
                            path="/station/:stationId"
                            element={<StationVehiclesPage />}
                        />
                        <Route
                            path="/book/:vehicleId"
                            element={<BookingPage />}
                        />
                        <Route
                            path="/admin/pickup"
                            element={<EBikePickupForm />}
                        />
                        <Route
                            path="/admin/dropoff"
                            element={<EBikeDropOffForm />}
                        />
                        <Route path="/kyc" element={<KYC />} />
                    </Routes>
                </main>
                <footer className="bg-gray-800 text-white py-8">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">
                                    EV Rentals
                                </h3>
                                <p className="text-gray-300">
                                    Sustainable, convenient, and affordable
                                    electric vehicle rental solutions.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4">
                                    Quick Links
                                </h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="/"
                                            className="text-gray-300 hover:text-white"
                                        >
                                            Home
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/locations"
                                            className="text-gray-300 hover:text-white"
                                        >
                                            Locations
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/login"
                                            className="text-gray-300 hover:text-white"
                                        >
                                            Login
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/register"
                                            className="text-gray-300 hover:text-white"
                                        >
                                            Register
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4">
                                    Contact Us
                                </h3>
                                <p className="text-gray-300">
                                    123 Main Street
                                    <br />
                                    City, State 12345
                                    <br />
                                    support@evrentals.com
                                    <br />
                                    (123) 456-7890
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                            <p>
                                © {new Date().getFullYear()} EV Rentals. All
                                rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: "#363636",
                            color: "#fff",
                            borderRadius: "8px",
                            padding: "16px",
                        },
                        success: {
                            duration: 3000,
                            style: {
                                background: "#10B981",
                                color: "#fff",
                            },
                        },
                        error: {
                            duration: 4000,
                            style: {
                                background: "#EF4444",
                                color: "#fff",
                            },
                        },
                    }}
                />
            </div>
        </Router>
    );
}

export default App;
