import React from 'react';

const SalesReceipt = ({ sale }) => {
  return (
    <div>
      <h2>Receipt</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{sale.product.name}</td>
            <td>{sale.quantity}</td>
            <td>{sale.product.price}</td>
            <td>{sale.total}</td>
          </tr>
        </tbody>
      </table>
      <p>Total: {sale.total}</p>
    </div>
  );
};

export default SalesReceipt;