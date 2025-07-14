import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";

const LowStockProductsList = () => {
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    API.get("/analytics/low-stock")
      .then(res => setLowStock(res.data))
      .catch(() => toast.error("Failed to load low stock products"));
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>🚨 Low Stock Products</h2>
      {lowStock.length === 0 ? (
        <p>All stocked up ✅</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.map((product) => (
              <tr key={product.id}>
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LowStockProductsList;
