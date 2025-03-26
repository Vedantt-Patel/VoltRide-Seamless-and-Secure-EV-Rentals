import { FaUser, FaCar, FaClock, FaMoneyBill } from "react-icons/fa"

const BookingSummary = () => {
  const bookings = [
    {
      id: "BK-001",
      userName: "John Doe",
      contact: "+1 234-567-8900",
      vehicleType: "Tesla Model 3",
      vehicleId: "VEH-001",
      startTime: "2024-03-15T09:00:00",
      endTime: "2024-03-15T14:00:00",
      duration: "5 hours",
      paymentStatus: "Paid",
      amount: 75.0,
    },
    {
      id: "BK-002",
      userName: "Jane Smith",
      contact: "+1 234-567-8901",
      vehicleType: "Nissan Leaf",
      vehicleId: "VEH-002",
      startTime: "2024-03-15T10:30:00",
      endTime: "2024-03-15T12:30:00",
      duration: "2 hours",
      paymentStatus: "Pending",
      amount: 30.0,
    },
  ]

  const getPaymentStatusColor = (status) => {
    return status === "Paid" ? "#4CAF50" : "#FFA500"
  }

  return (
    <div className="booking-summary card">
      <h2>Recent Bookings</h2>
      <div className="bookings-list">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <div className="booking-header">
              <h3>{booking.id}</h3>
              <span
                className="payment-status"
                style={{ backgroundColor: getPaymentStatusColor(booking.paymentStatus) }}
              >
                {booking.paymentStatus}
              </span>
            </div>

            <div className="booking-details">
              <div className="detail-row">
                <FaUser />
                <div>
                  <strong>{booking.userName}</strong>
                  <p>{booking.contact}</p>
                </div>
              </div>

              <div className="detail-row">
                <FaCar />
                <div>
                  <strong>{booking.vehicleType}</strong>
                  <p>ID: {booking.vehicleId}</p>
                </div>
              </div>

              <div className="detail-row">
                <FaClock />
                <div>
                  <p>Start: {new Date(booking.startTime).toLocaleString()}</p>
                  <p>End: {new Date(booking.endTime).toLocaleString()}</p>
                  <p>Duration: {booking.duration}</p>
                </div>
              </div>

              <div className="detail-row">
                <FaMoneyBill />
                <div>
                  <strong>${booking.amount.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BookingSummary

