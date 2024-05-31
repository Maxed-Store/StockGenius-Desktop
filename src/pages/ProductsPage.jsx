import React, { useState } from 'react';
import database from '../database/database';
import './ProductsPage.css';

const ProductsPage = ({ storeId }) => {
  const [userDefinedId, setUserDefinedId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const handleAddProduct = async () => {
    const product = await database.addProduct(storeId, userDefinedId, name, description, price, quantity);
    console.log('Added product:', product);
    setUserDefinedId('');
    setName('');
    setDescription('');
    setPrice(0);
    setQuantity(0);
  };

  return (
    <div className="products-page">
      <h2>Add Product</h2>
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="userDefinedId">Product Tag Number</label>
          <input
            type="text"
            id="userDefinedId"
            placeholder="Enter product tag number"
            value={userDefinedId}
            onChange={(e) => setUserDefinedId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Product Description</label>
          <input
            type="text"
            id="description"
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>
        <button onClick={handleAddProduct} disabled={!userDefinedId || !name || !description || price <= 0 || quantity <= 0}>
          Add Product
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;