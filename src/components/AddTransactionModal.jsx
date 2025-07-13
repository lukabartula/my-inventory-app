import React, { useState, useEffect } from "react";
import API from '../api/api';

const AddTransactionModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        product_id: '',
        quantity_change: '',
        change_type: 'in',
        reason: ''
    });

    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (isOpen) {
            API.get('/products')
                .then(res => setProducts(res.data))
                .catch(err => console.error('Failed to load products:', err));
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            product_id: parseInt(formData.product_id, 10),
            quantity_change: parseInt(formData.quantity_change, 10),
            change_type: formData.change_type,
            reason: formData.reason.trim()
        };

        try {
            await API.post('/transactions', payload);
            onSuccess();
            onClose();
        } catch (err) {
            alert('Failed to log transaction: ' + err.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Log New Transaction</h2>
                <form onSubmit={handleSubmit}>
                    <select name="product_id" value={formData.product_id} onChange={handleChange} required>
                        <option value="">-- Select Product --</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name} (SKU: {product.sku})
                            </option>
                        ))}
                    </select>

                    <input name="quantity_change" type="number" placeholder="Quantity" onChange={handleChange} required />
                    
                    <select name="change_type" value={formData.change_type} onChange={handleChange} required>
                        <option value="in">Stock In</option>
                        <option value="out">Stock Out</option>
                    </select>

                    <input name="reason" placeholder="Reason" onChange={handleChange} required />

                    <button type="submit">Submit</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;
