import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

const AddSaleModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: "",
    sale_price_per_unit: ""
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (isOpen) {
      API.get("/products")
        .then((res) => setProducts(res.data))
        .catch((err) => toast.error("Failed to load products"));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "product_id") {
      const selectedProduct = products.find(p => p.id === parseInt(value, 10));
      setFormData((prev) => ({
        ...prev,
        product_id: value,
        sale_price_per_unit: selectedProduct ? selectedProduct.selling_price : ''
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      product_id: parseInt(formData.product_id, 10),
      quantity: parseInt(formData.quantity, 10),
      sale_price_per_unit: parseFloat(formData.sale_price_per_unit)
    };

    try {
      await API.post("/sales", payload);
      toast.success("Sale logged successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Failed to log sale.");
    }
  };

  const totalPrice =
    parseFloat(formData.quantity || 0) *
    parseFloat(formData.sale_price_per_unit || 0);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Log New Sale</h2>
        <form onSubmit={handleSubmit}>
          <select
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Product --</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (SKU: {product.sku})
              </option>
            ))}
          </select>

          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <input
            name="sale_price_per_unit"
            type="number"
            step="0.01"
            placeholder="Sale Price per Unit"
            value={formData.sale_price_per_unit}
            onChange={handleChange}
            required
          />

          <p style={{ marginTop: '5px', fontWeight: 'bold', color: '#1abc9c' }}>
            💰 Total: ${isNaN(totalPrice) ? '0.00' : totalPrice.toFixed(2)}
          </p>

          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSaleModal;
