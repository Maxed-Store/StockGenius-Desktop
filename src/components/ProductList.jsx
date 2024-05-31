import React from 'react';

const ProductList = ({ products, onAddToBill }) => {
  return (
    <div>
      <h3>Products</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${product.price}</td>
              <td>{product.quantity}</td>
              <td>
                <button onClick={() => onAddToBill(product)}>Add to Bill</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;