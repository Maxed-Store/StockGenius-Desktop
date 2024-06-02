import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import database from '../database/database';
import './ProductsPage.css';

const ProductsPage = ({ storeId }) => {
  const [userDefinedId, setUserDefinedId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const handleAddProduct = async () => {
    const product = await database.addProduct(
      storeId,
      userDefinedId,
      name,
      description,
      price,
      quantity
    );
    console.log('Added product:', product);
    setUserDefinedId('');
    setName('');
    setDescription('');
    setPrice(0);
    setQuantity(0);
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Add Product
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              variant="outlined"
              label="Product Tag Number"
              value={userDefinedId}
              onChange={(e) => setUserDefinedId(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              label="Price"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleAddProduct}
              disabled={!userDefinedId || !name || !description || price <= 0 || quantity <= 0}
            >
              Add Product
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProductsPage;
