import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import AddTransactionModal from '../components/AddTransactionModal';
import API from '../api/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddSuccess = () => {
    fetchTransactions();         // Refresh the list
    setShowModal(false);         // Close modal
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Transactions</h1>
          <button className="add-button" onClick={() => setShowModal(true)}>
            + Log Transaction
          </button>
        </div>

        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Reason</th>
                <th>User ID</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={index}>
                  <td>{txn.product_name}</td>
                  <td>{txn.change_type}</td>
                  <td>{txn.quantity_change}</td>
                  <td>{txn.reason || '—'}</td>
                  <td>{txn.user_id}</td>
                  <td>{new Date(txn.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <AddTransactionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleAddSuccess}
        />
      </div>
    </div>
  );
};

export default Transactions;