import React, { useState, useEffect } from 'react';
import db from '../database/database'

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [newPurchaseOrder, setNewPurchaseOrder] = useState({
    supplierId: null,
    storeId: 1, 
    items: [],
    totalCost: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const suppliers = await db.getSuppliers();
      setSuppliers(suppliers);

      const purchaseOrders = await db.getPurchaseOrders(newPurchaseOrder.storeId);
      setPurchaseOrders(purchaseOrders);
    };

    fetchData();
  }, []);

  const handleSupplierChange = (e) => {
    setNewSupplier({ ...newSupplier, [e.target.name]: e.target.value });
  };

  const handleAddSupplier = async () => {
    const { name, email, phone, address } = newSupplier;
    const supplier = await db.addSupplier(name, email, phone, address);
    setSuppliers([...suppliers, supplier]);
    setNewSupplier({ name: '', email: '', phone: '', address: '' });
  };

  const handlePurchaseOrderChange = (e) => {
    setNewPurchaseOrder({ ...newPurchaseOrder, [e.target.name]: e.target.value });
  };

  const handleAddPurchaseOrder = async () => {
    const { supplierId, storeId, items, totalCost } = newPurchaseOrder;
    const purchaseOrder = await db.placePurchaseOrder(supplierId, storeId, items, totalCost);
    setPurchaseOrders([...purchaseOrders, purchaseOrder]);
    setNewPurchaseOrder({
      supplierId: null,
      storeId: 1,
      items: [],
      totalCost: 0,
    });
  };

  return (
    <div>
      <h2>Supplier Management</h2>
      <div>
        <h3>Add Supplier</h3>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newSupplier.name}
          onChange={handleSupplierChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newSupplier.email}
          onChange={handleSupplierChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={newSupplier.phone}
          onChange={handleSupplierChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={newSupplier.address}
          onChange={handleSupplierChange}
        />
        <button onClick={handleAddSupplier}>Add Supplier</button>
      </div>
      <div>
        <h3>Suppliers List</h3>
        <ul>
          {suppliers.map((supplier) => (
            <li key={supplier.id}>
              {supplier.name} - {supplier.email} - {supplier.phone} - {supplier.address}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Place Purchase Order</h3>
        <select
          name="supplierId"
          value={newPurchaseOrder.supplierId || ''}
          onChange={handlePurchaseOrderChange}
        >
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="items"
          placeholder="Items (comma-separated)"
          value={newPurchaseOrder.items.join(', ')}
          onChange={handlePurchaseOrderChange}
        />
        <input
          type="number"
          name="totalCost"
          placeholder="Total Cost"
          value={newPurchaseOrder.totalCost}
          onChange={handlePurchaseOrderChange}
        />
        <button onClick={handleAddPurchaseOrder}>Place Purchase Order</button>
      </div>
      <div>
        <h3>Purchase Orders</h3>
        <ul>
          {purchaseOrders.map((order) => (
            <li key={order.id}>
              Supplier: {suppliers.find((supplier) => supplier.id === order.supplierId)?.name}
              <br />
              Items: {order.items.join(', ')}
              <br />
              Total Cost: {order.totalCost}
              <br />
              Placed At: {new Date(order.placedAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SupplierManagement;