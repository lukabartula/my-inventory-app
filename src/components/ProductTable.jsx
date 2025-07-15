import React, { useState, useEffect } from "react";
import API from "../api/api";

const ProductTable = ({ products, onEdit, onDelete }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user just like in Profile.jsx
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const payload = JSON.parse(atob(token.split(".")[1]));
        const res = await API.get(`/users/${payload.id}`);
        setCurrentUser(res.data);
      } catch {
        // Optionally handle error
      }
    };
    fetchCurrentUser();
  }, []);

  if (!products || products.length === 0) {
    return <p>No products available.</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>SKU</th>
          <th>Name</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Cost</th>
          <th>Price</th>
          {currentUser?.role === "admin" && <th>Edit</th>}
          {currentUser?.role === "admin" && <th>Delete</th>}
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={index}>
            <td>{product.sku}</td>
            <td>{product.name}</td>
            <td>{product.category || "—"}</td>
            <td>{product.quantity}</td>
            <td>${product.cost_price.toFixed(2)}</td>
            <td>${product.selling_price.toFixed(2)}</td>
            {currentUser?.role === "admin" && (
              <>
                <td>
                  <button onClick={() => onEdit(product)}>✏️</button>
                </td>
                <td>
                  <button onClick={() => onDelete(product.id)}>🗑️</button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
