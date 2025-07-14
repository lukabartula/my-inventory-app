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

const MonthlyProfitChart = () => {
  const [monthlyProfit, setMonthlyProfit] = useState([]);

  useEffect(() => {
    const fetchProfit = async () => {
      try {
        const res = await API.get("/analytics/monthly-profit");
        setMonthlyProfit(res.data);
      } catch (err) {
        toast.error("Failed to load monthly profit.");
      }
    };

    fetchProfit();
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>💸 Monthly Profit</h2>
      {monthlyProfit.length === 0 ? (
        <p>Loading profit data...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyProfit}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="monthlyProfit"
              stroke="#e67e22"
              strokeWidth={2}
              name="Profit"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MonthlyProfitChart;
