import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import AddSaleModal from '../components/AddSaleModal';
import { toast } from 'react-toastify';
import API from '../api/api';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);


  const fetchSales = async () => {
    try {
      const res = await API.get('/sales');
      setSales(res.data);
    } catch (err) {
      toast.error('Failed to fetch sales:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Sales</h1>
          <button className="add-button" onClick={() => setShowModal(true)}>
            + Add Sale
          </button>
        </div>

        {loading ? (
          <p>Loading sales...</p>
        ) : sales.length === 0 ? (
          <p>No sales found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price/Unit</th>
                <th>Total</th>
                <th>Sold By</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => (
                <tr key={index}>
                  <td>{sale.product_name}</td>
                  <td>{sale.quantity}</td>
                  <td>${sale.sale_price_per_unit.toFixed(2)}</td>
                  <td>${sale.total_sale_price.toFixed(2)}</td>
                  <td>{sale.sold_by}</td>
                  <td>{new Date(sale.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <AddSaleModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchSales();
            setShowModal(false);
          }}
        />
      </div>
    </div>
  );
};

export default Sales;
