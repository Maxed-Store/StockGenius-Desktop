import React from 'react';
import database from '../database/database';

const SalesForm = ({ storeId }) => {
  const [productId, setProductId] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);
  const [sale, setSale] = React.useState(null);

  const handleSellProduct = () => {
    const saleResult = database.sellProduct(storeId, productId, quantity);
    if (saleResult) {
      console.log('Product sold:', saleResult);
      setSale(saleResult);
    } else {
      console.log('Not enough stock or invalid product ID');
    }
  };

  return (
    <div>
      <h2>Sell Product</h2>
      <input
        type="number"
        placeholder="Product ID"
        value={productId || ''}
        onChange={(e) => setProductId(parseInt(e.target.value))}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
      <button onClick={handleSellProduct} disabled={!storeId || !productId}>
        Sell
      </button>
      {sale && <SalesReceipt sale={sale} />}
    </div>
  );
};

export default SalesForm;