import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const RevenueSummary = () => {
  const revenueData = {
    today: 450.0,
    weekly: 2850.0,
    monthly: 12500.0,
    pendingPayments: 750.0,
    paymentModes: [
      { name: "Credit Card", value: 65 },
      { name: "Debit Card", value: 20 },
      { name: "Digital Wallet", value: 15 },
    ],
    weeklyTrend: [
      { day: "Mon", amount: 380 },
      { day: "Tue", amount: 420 },
      { day: "Wed", amount: 450 },
      { day: "Thu", amount: 350 },
      { day: "Fri", amount: 480 },
      { day: "Sat", amount: 520 },
      { day: "Sun", amount: 250 },
    ],
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

  return (
    <div className="revenue-summary card">
      <h2>Revenue Summary</h2>

      <div className="revenue-stats">
        <div className="stat-box">
          <h3>Today's Revenue</h3>
          <p className="amount">${revenueData.today.toLocaleString()}</p>
        </div>
        <div className="stat-box">
          <h3>Weekly Revenue</h3>
          <p className="amount">${revenueData.weekly.toLocaleString()}</p>
        </div>
        <div className="stat-box">
          <h3>Monthly Revenue</h3>
          <p className="amount">${revenueData.monthly.toLocaleString()}</p>
        </div>
        <div className="stat-box warning">
          <h3>Pending Payments</h3>
          <p className="amount">${revenueData.pendingPayments.toLocaleString()}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h3>Weekly Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Payment Modes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={revenueData.paymentModes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                label
              >
                {revenueData.paymentModes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default RevenueSummary

