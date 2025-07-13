import React, { useState } from "react";
import API from '../api/api';

const AddProductModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        category: '',
        quantity: '',
        cost_price: '',
        selling_price: ''
    });

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            sku: formData.sku.trim(),
            name: formData.name.trim(),
            category: formData.category.trim(),
            quantity: parseInt(formData.quantity, 10),
            cost_price: parseFloat(formData.cost_price),
            selling_price: parseFloat(formData.selling_price),
          };
        
        console.log('Payload being sent:', payload);
        try {
            await API.post('/products', payload);
            onSuccess();
            onClose();
        } catch (err) {
            alert('Failed to add product', + err.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Add new product</h2>
                <form onSubmit={handleSubmit}>
                    <input name="sku" placeholder="SKU" onChange={handleChange} required />
                    <input name="name" placeholder="Product Name" onChange={handleChange} required />
                    <input name="category" placeholder="Category" onChange={handleChange} />
                    <input name="quantity" type="number" placeholder="Quantity" onChange={handleChange} required />
                    <input name="cost_price" type="number" step="0.01" placeholder="Cost Price" onChange={handleChange} required />
                    <input name="selling_price" type="number" step="0.01" placeholder="Selling Price" onChange={handleChange} required />
                    <button type="submit">Add</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};


export default AddProductModal;