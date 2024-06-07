import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import db from '../database/database';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortModel, setSortModel] = useState([{ field: 'name', sort: 'asc' }]);
  const [page, setPage] = useState(0); 
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const fetchProducts = async () => {
    const allProducts = await db.getProducts(1, page + 1, pageSize);
    console.log(allProducts);
    setProducts(allProducts);
    // Optionally, fetch and set the total number of products for pagination controls
    // Assuming getProductsCount is a method that returns the total number of products
    const totalProducts = await db.getProductsCount(1); 
    setRowCount(totalProducts);
  };

  useEffect(() => {

    fetchProducts();
  }, [page, pageSize]);

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleSave = async () => {
    const { id, name, description, price, quantity } = selectedProduct;
    await db.updateProduct(id, name, description, price, quantity);
    fetchProducts();
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'price', headerName: 'Price', type: 'number', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', type: 'number', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleOpen(params.row)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <h2>Product Management</h2>
      <DataGrid
        rows={products}
        columns={columns}
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
        pagination
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]}
        rowCount={rowCount}
        paginationMode="server"
        onPageChange={(newPage) => setPage(newPage)}
        page={page}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            value={selectedProduct?.name || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            value={selectedProduct?.description || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            value={selectedProduct?.price || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="quantity"
            label="Quantity"
            type="number"
            value={selectedProduct?.quantity || ''}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductManagement;