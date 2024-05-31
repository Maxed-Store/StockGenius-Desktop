import React from 'react';

const BillReceipt = ({ billItems, onRemoveFromBill }) => {
  const totalAmount = billItems.reduce((total, item) => total + item.price, 0);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {billItems.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>
                <button onClick={() => onRemoveFromBill(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="total-amount">Total Amount: ${totalAmount.toFixed(2)}</div>
    </div>
  );
};

export default BillReceipt;