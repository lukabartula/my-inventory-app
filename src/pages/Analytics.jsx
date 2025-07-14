import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../api/api';
import { toast } from 'react-toastify';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from 'recharts';

const Analytics = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await API.get('/analytics/monthly-revenue');
        setMonthlyRevenue(res.data); // keep raw "2025-07" as month label
      } catch (err) {
        toast.error('Failed to load monthly revenue.');
      }
    };

    fetchRevenue();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <h1>Analytics</h1>

        <div style={{ marginTop: '30px' }}>
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
      </div>
    </div>
  );
};

export default Analytics;
