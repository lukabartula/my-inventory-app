import React from 'react';

const ProductTable = ({ products, onEdit, onDelete }) => {
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
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={index}>
            <td>{product.sku}</td>
            <td>{product.name}</td>
            <td>{product.category || '—'}</td>
            <td>{product.quantity}</td>
            <td>${product.cost_price.toFixed(2)}</td>
            <td>${product.selling_price.toFixed(2)}</td>
            <td>
              <button onClick={() => onEdit(product)}>✏️</button>
            </td>
            <td>
              <button onClick={() => onDelete(product.id)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
