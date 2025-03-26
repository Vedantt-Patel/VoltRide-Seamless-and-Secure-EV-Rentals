import { Link } from "react-router-dom";
import {
    Clock,
    Shield,
    MapPin,
    ChevronRight,
    Car,
    Zap,
    Leaf,
} from "lucide-react";
import { useEffect, useState } from "react";

function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isKYCVerified, setIsKYCVerified] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setIsAuthenticated(true);
            setIsKYCVerified(user.isKYCVerified || false);
        }
    }, []);

    const renderActionButton = () => {
        if (!isAuthenticated) {
            return (
                <Link
                    to="/register"
                    className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center"
                >
                    Create an Account
                </Link>
            );
        } else if (!isKYCVerified) {
            return (
                <Link
                    to="/kyc"
                    className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center"
                >
                    Complete KYC
                </Link>
            );
        }
        return null;
    };

    return (
        <div className="pt-16">
            {" "}
            {/* Add padding top to account for fixed navbar */}
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                                Sustainable Mobility{" "}
                                <span className="text-green-600">
                                    On Demand
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 max-w-lg">
                                Rent electric vehicles with ease. Eco-friendly,
                                convenient, and affordable transportation
                                solutions.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/locations"
                                    className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                                >
                                    Find Nearby Stations
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Link>
                                {renderActionButton()}
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <img
                                src="../public/1.jpeg"
                                alt="Electric Vehicle"
                                className="rounded-xl shadow-2xl object-cover w-full h-[400px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Features Section */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Why Choose EV Rentals
                </h2>
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border-t-4 border-green-600">
                        <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                            <Leaf className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Eco-Friendly
                        </h3>
                        <p className="text-gray-600">
                            Zero emissions and sustainable transportation
                            options for a greener planet.
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border-t-4 border-blue-600">
                        <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                            <Clock className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Flexible Rentals
                        </h3>
                        <p className="text-gray-600">
                            Rent by the hour or day, whatever suits your needs
                            and schedule.
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border-t-4 border-purple-600">
                        <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                            <Shield className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Secure & Safe
                        </h3>
                        <p className="text-gray-600">
                            Verified users and well-maintained vehicles for your
                            peace of mind.
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border-t-4 border-orange-600">
                        <div className="bg-orange-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                            <MapPin className="h-8 w-8 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Many Locations
                        </h3>
                        <p className="text-gray-600">
                            Multiple convenient pickup stations throughout the
                            city.
                        </p>
                    </div>
                </div>
            </div>
            {/* How It Works Section */}
            <div className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        How It Works
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <MapPin className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                1. Find a Station
                            </h3>
                            <p className="text-gray-600">
                                Locate the nearest EV station using our
                                interactive map.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Car className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                2. Book a Vehicle
                            </h3>
                            <p className="text-gray-600">
                                Choose your preferred electric vehicle and
                                booking duration.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Zap className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                3. Enjoy Your Ride
                            </h3>
                            <p className="text-gray-600">
                                Unlock the vehicle with your QR code and enjoy
                                your eco-friendly journey.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* CTA Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Go Electric?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join thousands of users who are already enjoying the
                        benefits of electric mobility.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/locations"
                            className="bg-white text-green-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Find Nearby Stations
                        </Link>
                        <Link
                            to="/register"
                            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors"
                        >
                            Create an Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
