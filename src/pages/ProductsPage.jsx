import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import database from '../database/database';
import './ProductsPage.css';
import AddCategoryModal from './AddCategoryModal.jsx';

const ProductsPage = ({ storeId }) => {
  const [userDefinedId, setUserDefinedId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await database.getCategories();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (newCategoryName) {
      await database.addCategory(newCategoryName);
      const categories = await database.getCategories();
      setCategories(categories);
    }
  };

  const handleAddProduct = async () => {
    const product = await database.addProduct(
      storeId,
      userDefinedId,
      name,
      description,
      price,
      quantity,
      categoryId
    );
    console.log('Added product:', product);
    setUserDefinedId('');
    setName('');
    setDescription('');
    setPrice(0);
    setQuantity(0);
    setCategoryId('');
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
              color='secondary'
              label="Product Tag Number"
              value={userDefinedId}
              onChange={(e) => setUserDefinedId(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Product Name"
              color='secondary'
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Product Description"
              color='secondary'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              color='secondary'
              label="Price"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              color='secondary'
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                color='secondary'
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              color='secondary'
              onClick={handleAddProduct}
              disabled={!userDefinedId || !name || !description || price <= 0 || quantity <= 0 || !categoryId}
            >
              Add Product
            </Button>
          </Box>
        </Paper>
      </Box>
      <Box my={4}>
        <Typography variant="h6" gutterBottom>
          Add New Category (Optional)
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <AddCategoryModal handleAddCategory={handleAddCategory} />
        </Paper>
      </Box>
    </Container>
  );
};

export default ProductsPage;