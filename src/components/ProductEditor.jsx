import React from 'react';
import database from '../database';

const ProductEditor = ({ storeId, product, onUpdate }) => {
  const [name, setName] = React.useState(product.name);
  const [description, setDescription] = React.useState(product.description);
  const [price, setPrice] = React.useState(product.price);
  const [quantity, setQuantity] = React.useState(product.quantity);

  const handleUpdateProduct = async () => {
    const updatedProduct = await database.updateProduct(storeId, product._id, name, description, price, quantity);
    onUpdate(updatedProduct);
  };

  return (
    <div>
      <h3>Edit Product</h3>
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
      <button onClick={handleUpdateProduct}>Update Product</button>
    </div>
  );
};

export default ProductEditor;