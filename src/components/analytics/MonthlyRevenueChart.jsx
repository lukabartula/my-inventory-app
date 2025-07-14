import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

const MonthlyRevenueChart = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await API.get("/analytics/monthly-revenue");
        setMonthlyRevenue(res.data);
      } catch (err) {
        toast.error("Failed to load monthly revenue.");
      }
    };

    fetchRevenue();
  }, []);

  return (
    <div style={{ marginBottom: "40px" }}>
      <h2>📈 Monthly Revenue</h2>
      {monthlyRevenue.length === 0 ? (
        <p>Loading revenue data...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="monthlyRevenue"
              stroke="#1abc9c"
              strokeWidth={2}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MonthlyRevenueChart;