import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

const TopSellingProductsChart = () => {
  const [bestProducts, setBestProducts] = useState([]);

  useEffect(() => {
    const fetchBestProducts = async () => {
      try {
        const res = await API.get("/analytics/best-products");
        setBestProducts(res.data);
      } catch (err) {
        toast.error("Failed to load top-selling products.");
      }
    };

    fetchBestProducts();
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>🥇 Top-Selling Products</h2>
      {bestProducts.length === 0 ? (
        <p>Loading top products...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bestProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="productName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalSold" fill="#3498db" name="Units Sold" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TopSellingProductsChart;
