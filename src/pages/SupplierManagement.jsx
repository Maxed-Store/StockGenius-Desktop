import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
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
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [confirmOrderId, setConfirmOrderId] = useState(null);

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
      setOpenConfirmDialog(true);
      setConfirmOrderId(purchaseOrder.id);
    } catch (error) {
      toast.error('Error placing purchase order');
    }
  };

  const handleConfirmOrder = async () => {
    try {
      const confirmed = !purchaseOrders.find((order) => order.id === confirmOrderId)?.confirmed;
      const updatedOrder = await db.updatePurchaseOrderConfirmation(confirmOrderId, confirmed);
      const updatedOrders = purchaseOrders.map((order) =>
        order.id === confirmOrderId ? updatedOrder : order
      );
      setPurchaseOrders(updatedOrders);
      setOpenConfirmDialog(false);
      toast.success(`Order ${confirmed ? 'confirmed' : 'unconfirmed'} successfully`);
    } catch (error) {
      toast.error('Error updating order confirmation');
    }
  };
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortField(field);
    setSortDirection(isAsc ? 'desc' : 'asc');
  };

  const sortedAndFilteredData = useMemo(() => {
    let sortedData = [...purchaseOrders];
    if (sortField) {
      sortedData.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    if (searchQuery) {
      sortedData = sortedData.filter((order) =>
        order.items.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return sortedData;
  }, [purchaseOrders, sortField, sortDirection, searchQuery]);

  return (
    <SupplierManagementContainer>
      <Title>Supplier Management</Title>
      <SectionContainer>
      </SectionContainer>
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
        <StyledButton variant="contained" onClick={handleAddSupplier}>
          Add Supplier
        </StyledButton>
      </SectionContainer>
      <SectionContainer>
        <SubTitle>Suppliers List</SubTitle>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </SectionContainer>
      <SectionContainer>
        {/* ... */}
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
        <StyledButton variant="contained" onClick={handleAddPurchaseOrder}>
          Place Purchase Order
        </StyledButton>
      </SectionContainer>
      <SectionContainer>
        <SubTitle>Purchase Orders</SubTitle>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <TextField
              label="Search Items"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: '20px' }}
            />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell onClick={() => handleSort('supplier')}>Supplier</TableCell>
                    <TableCell onClick={() => handleSort('items')}>Items</TableCell>
                    <TableCell onClick={() => handleSort('totalCost')}>Total Cost</TableCell>
                    <TableCell onClick={() => handleSort('placedAt')}>Placed At</TableCell>
                    <TableCell onClick={() => handleSort('confirmed')}>Received</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedAndFilteredData.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        {suppliers.find((supplier) => supplier.id === order.supplierId)?.name}
                      </TableCell>
                      <TableCell>
                        <div>
                          {order.items.filter((item) => item.trim() !== '').map((item, index) => (
                            <Chip
                              key={index}
                              label={item}
                              style={{
                                margin: 2,
                                backgroundColor: 'green',
                                color: 'white',
                              }}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{order.totalCost}</TableCell>
                      <TableCell>{new Date(order.placedAt).toLocaleString()}</TableCell>
                      <TableCell>{order.confirmed ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        {order.confirmed ? (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                              setOpenConfirmDialog(true);
                              setConfirmOrderId(order.id);
                            }}
                          >
                            Unconfirm
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setOpenConfirmDialog(true);
                              setConfirmOrderId(order.id);
                            }}
                          >
                            Confirm
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </SectionContainer>
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirm Order</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to confirm this Action?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmOrder} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </SupplierManagementContainer>
  );
};

export default SupplierManagement;