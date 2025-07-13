import React, { useEffect, useState } from "react";
import API from '../api/api';

const AddProductModal = ({ isOpen, onClose, onSuccess, editingProduct }) => {
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        category: '',
        quantity: '',
        cost_price: '',
        selling_price: ''
    });

    // Load form with product if editing
    useEffect(() => {
        if (editingProduct) {
            setFormData({
                sku: editingProduct.sku || '',
                name: editingProduct.name || '',
                category: editingProduct.category || '',
                quantity: editingProduct.quantity || '',
                cost_price: editingProduct.cost_price || '',
                selling_price: editingProduct.selling_price || ''
            });
        } else {
            setFormData({
                sku: '',
                name: '',
                category: '',
                quantity: '',
                cost_price: '',
                selling_price: ''
            });
        }
    }, [editingProduct]);

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

        try {
            if (editingProduct) {
                // EDIT
                await API.put(`/products/${editingProduct.id}`, payload);
            } else {
                // ADD NEW
                await API.post('/products', payload);
            }

            onSuccess();
        } catch (err) {
            alert(`Failed to ${editingProduct ? 'update' : 'add'} product: ${err.message}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        name="sku"
                        placeholder="SKU"
                        value={formData.sku}
                        onChange={handleChange}
                        required
                        disabled={!!editingProduct} // don't allow editing SKU
                    />
                    <input
                        name="name"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="category"
                        placeholder="Category"
                        value={formData.category}
                        onChange={handleChange}
                    />
                    <input
                        name="quantity"
                        type="number"
                        placeholder="Quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="cost_price"
                        type="number"
                        step="0.01"
                        placeholder="Cost Price"
                        value={formData.cost_price}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="selling_price"
                        type="number"
                        step="0.01"
                        placeholder="Selling Price"
                        value={formData.selling_price}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">{editingProduct ? 'Update' : 'Add'}</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;