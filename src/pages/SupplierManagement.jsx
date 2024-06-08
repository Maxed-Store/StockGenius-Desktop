import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Typography, TextField, Button, Select, MenuItem, CircularProgress, List, ListItem } from '@mui/material';
import { styled } from '@mui/system';
import db from '../database/database';
import { Chip } from '@material-ui/core';

const SupplierManagementContainer = styled('div')`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionContainer = styled('div')`
  margin-bottom: 30px;
`;

const Title = styled(Typography)`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const SubTitle = styled(Typography)`
  font-size: 18px;
  margin-bottom: 10px;
  color: #555;
`;

const Input = styled(TextField)`
  margin-right: 10px;
  margin-bottom: 10px;
`;

const StyledButton = styled(Button)`
  margin-top: 10px;
`;

const LoadingSpinner = styled(CircularProgress)`
  margin-top: 20px;
`;

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
    supplierId: '',
    storeId: 1,
    items: [],
    totalCost: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const suppliersData = await db.getSuppliers();
        setSuppliers(suppliersData);

        const purchaseOrdersData = await db.getPurchaseOrders(newPurchaseOrder.storeId);
        setPurchaseOrders(purchaseOrdersData);
      } catch (error) {
        toast.error('Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSupplierChange = (e) => {
    setNewSupplier({ ...newSupplier, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateSupplier = () => {
    const errors = {};
    if (!newSupplier.name) {
      errors.name = 'Name is required';
    }
    if (!newSupplier.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newSupplier.email)) {
      errors.email = 'Invalid email address';
    }
    if (!newSupplier.phone) {
      errors.phone = 'Phone number is required';
    }
    if (!newSupplier.address) {
      errors.address = 'Address is required';
    }
    return errors;
  };

  const handleAddSupplier = async () => {
    const errors = validateSupplier();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const { name, email, phone, address } = newSupplier;
      const supplier = await db.addSupplier(name, email, phone, address);
      setSuppliers([...suppliers, supplier]);
      setNewSupplier({ name: '', email: '', phone: '', address: '' });
      toast.success('Supplier added successfully');
    } catch (error) {
      toast.error('Error adding supplier');
    }
  };

  const handlePurchaseOrderChange = (e) => {
    if (e.target.name === 'items') {
      setNewPurchaseOrder({
        ...newPurchaseOrder,
        [e.target.name]: e.target.value.split(',').map((item) => item.trim()),
      });
    } else {
      setNewPurchaseOrder({ ...newPurchaseOrder, [e.target.name]: e.target.value });
    }
  };

  const handleAddPurchaseOrder = async () => {
    if (!newPurchaseOrder.supplierId) {
      toast.error('Please select a supplier');
      return;
    }

    if (newPurchaseOrder.items.length === 0) {
      toast.error('Please enter items');
      return;
    }

    if (!newPurchaseOrder.totalCost || newPurchaseOrder.totalCost <= 0) {
      toast.error('Please enter a valid total cost');
      return;
    }

    try {
      const { supplierId, storeId, items, totalCost } = newPurchaseOrder;
      const purchaseOrder = await db.placePurchaseOrder(supplierId, storeId, items, totalCost);
      setPurchaseOrders([...purchaseOrders, purchaseOrder]);
      setNewPurchaseOrder({
        supplierId: '',
        storeId: 1,
        items: [],
        totalCost: 0,
      });
      toast.success('Purchase order placed successfully');
    } catch (error) {
      toast.error('Error placing purchase order');
    }
  };

  return (
    <SupplierManagementContainer>
      <Title>Supplier Management</Title>
      <SectionContainer>
        <SubTitle>Add Supplier</SubTitle>
        <Input
          type="text"
          name="name"
          label="Name"
          value={newSupplier.name}
          onChange={handleSupplierChange}
          error={!!errors.name}
          helperText={errors.name}
        />
        <Input
          type="email"
          name="email"
          label="Email"
          value={newSupplier.email}
          onChange={handleSupplierChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <Input
          type="text"
          name="phone"
          label="Phone"
          value={newSupplier.phone}
          onChange={handleSupplierChange}
          error={!!errors.phone}
          helperText={errors.phone}
        />
        <Input
          type="text"
          name="address"
          label="Address"
          value={newSupplier.address}
          onChange={handleSupplierChange}
          error={!!errors.address}
          helperText={errors.address}
        />
        <StyledButton variant="contained" onClick={handleAddSupplier}>Add Supplier</StyledButton>
      </SectionContainer>
      <SectionContainer>
        <SubTitle>Suppliers List</SubTitle>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <List>
            {suppliers.map((supplier) => (
              <ListItem key={supplier.id}>
                <strong>{supplier.name}</strong>
                <br />
                {supplier.email} - {supplier.phone}
                <br />
                {supplier.address}
              </ListItem>
            ))}
          </List>
        )}
      </SectionContainer>
      <SectionContainer>
        <SubTitle>Place Purchase Order</SubTitle>
        <Select
          name="supplierId"
          value={newPurchaseOrder.supplierId}
          onChange={handlePurchaseOrderChange}
          displayEmpty={true}
        >
          <MenuItem value="">Select Supplier</MenuItem>
          {suppliers.map((supplier) => (
            <MenuItem key={supplier.id} value={supplier.id}>
              {supplier.name}
            </MenuItem>
          ))}
        </Select>
        <Input
          type="text"
          name="items"
          label="Items (comma-separated)"
          value={newPurchaseOrder.items.join(', ')}
          onChange={handlePurchaseOrderChange}
        />
        <Input
          type="number"
          name="totalCost"
          label="Total Cost"
          value={newPurchaseOrder.totalCost}
          onChange={handlePurchaseOrderChange}
        />
        <StyledButton variant="contained" onClick={handleAddPurchaseOrder}>Place Purchase Order</StyledButton>
      </SectionContainer>
      <SectionContainer>
        <SubTitle>Purchase Orders</SubTitle>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <List>
            {purchaseOrders.map((order) => (
              <ListItem key={order.id}>
                <strong>Supplier:</strong> {suppliers.find((supplier) => supplier.id === order.supplierId)?.name}
                <br />
                <strong>Items:</strong> <div>
                  {order.items.map((item, index) => (
                    <Chip
                      key={index} label={item} style={{ margin: 2 }} />
                  ))}
                </div>
                <br />
                <strong>Total Cost:</strong> {order.totalCost}
                <br />
                <strong>Placed At:</strong> {new Date(order.placedAt).toLocaleString()}
              </ListItem>
            ))}
          </List>
        )}
      </SectionContainer>
    </SupplierManagementContainer>
  );
};

export default SupplierManagement;
