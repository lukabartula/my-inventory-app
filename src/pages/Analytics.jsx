import React from 'react';
import Sidebar from '../components/Sidebar';
import MonthlyRevenueChart from '../components/analytics/MonthlyRevenueChart';
import TopSellingProductsChart from '../components/analytics/TopSellingProductsChart';
import LowStockProductsList from '../components/analytics/LowStockProductsList';
import MonthlyProfitChart from '../components/analytics/MonthlyProfitChart';

const Analytics = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="dashboard-header">
            <h1>Analytics</h1>
        </div>

        {/* Monthly Revenue Chart Component */}
        <MonthlyRevenueChart />
        {/* Top Selling Products Chart Component */}
        <TopSellingProductsChart />
        {/* Low Stock Products List */}
        <LowStockProductsList />
        {/* Monthly Profit Chart Component */}
        <MonthlyProfitChart />

      </div>
    </div>
  );
};

export default Analytics;
