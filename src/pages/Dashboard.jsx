import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api/api";
import AddProductModal from "../components/AddProductModal";
import ProductTable from "../components/ProductTable";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);


  const handleAddSuccess = () => {
    console.log("Product added!");
    fetchSummary(); // Optionally refresh stats
  };
  const handleDeleteProduct = async (productId) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    await API.delete(`/products/${productId}`);
    fetchProducts();
  } catch (err) {
    alert("Failed to delete product: " + err.message);
  }
};


  const fetchSummary = async () => {
    try {
      const res = await API.get("/analytics/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to load summary:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchProducts();
  }, []);

  return (
    <>
      <div className="dashboard-container">
        <Sidebar />

        <div className="main-content">
          {summary ? (
            <div className="summary-grid">
              <div className="summary-card products">
                <h2>{summary.totalProducts}</h2>
                <p>Total Products</p>
              </div>
              <div className="summary-card lowstock">
                <h2>{summary.lowStockCount}</h2>
                <p>Low Stock</p>
              </div>
              <div className="summary-card revenue">
                <h2>${summary.totalRevenue?.toFixed(2)}</h2>
                <p>Total Revenue</p>
              </div>
              <div className="summary-card sales">
                <h2>{summary.totalSales}</h2>
                <p>Total Sales</p>
              </div>
            </div>
          ) : (
            <p>Loading summary...</p>
          )}

          <div className="dashboard-header">
            <h1>Inventory</h1>
            <button className="add-button" onClick={() => setShowModal(true)}>
              + Add new product
            </button>
          </div>

          <div className="inventory-table">
            <ProductTable
                products={products}
                onEdit={(product) => {
                    setEditProduct(product);
                    setShowModal(true);
                }}
                onDelete={handleDeleteProduct}
            />

          </div>
        </div>
      </div>

      <AddProductModal
        isOpen={showModal}
        onClose={() => {
            setShowModal(false);
            setEditProduct(null);
        }}
        onSuccess={() => {
            fetchProducts();
            setShowModal(false);
            setEditProduct(null);
        }}
        editingProduct={editProduct}
     />

    </>
  );
};

export default Dashboard;
