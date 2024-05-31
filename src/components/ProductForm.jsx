import React from 'react';
import database from '../database/database';
const ProductForm = ({ storeId }) => {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [quantity, setQuantity] = React.useState(0);

  const handleAddProduct = () => {
    const product = database.addProduct(storeId, name, description, price, quantity);
    console.log('Added product:', product);
    // Clear the input fields after adding the product
    setName('');
    setDescription('');
    setPrice(0);
    setQuantity(0);
  };

  return (
    <div>
      <h2>Add Product</h2>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Product Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(parseFloat(e.target.value))}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
      <button onClick={handleAddProduct} disabled={!storeId}>
        Add Product
      </button>
    </div>
  );
};

export default ProductForm;