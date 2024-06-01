import React, { useState, useEffect } from 'react';
import database from '../database/database';
import ProductList from '../components/ProductList.jsx';
import BillReceipt from '../components/BillReceipt.jsx';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  List,
  ListItem,
  Card,
  CardContent,
  CardActions,
  Grid,
  Paper,
  Box,
  CssBaseline,
  Collapse,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const HomePage = ({ storeId = 1 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [error, setError] = useState(null);
  const [store, setStore] = useState(null);
  const [newStoreName, setNewStoreName] = useState('');
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchStore = async () => {
      const stores = await database.getStores();
      if (stores.length > 0) {
        setStore(stores[0]);
      }
    };

    const fetchRecentSearches = async () => {
      if (storeId !== undefined) {
        const recentSearches = await database.getRecentSearches(storeId);
        setRecentSearches(recentSearches);
      }
    };

    fetchStore();
    fetchRecentSearches();
  }, [storeId]);

  const handleSearch = async (searchTerms) => {
    try {
      const searchResults = await database.searchProducts(searchTerms);
      if (searchResults.length === 0) {
        setError('No products found');
      } else {
        setError(null);
        setProducts(searchResults);
        await database.addRecentSearch(storeId, searchTerms);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddToBill = (product) => {
    setBillItems((prevBillItems) => [...prevBillItems, product]);
  };

  const handleRemoveFromBill = (index) => {
    setBillItems((prevBillItems) => prevBillItems.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const billHTML = document.querySelector('.bill-container').outerHTML;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <style>
            /* Define your print styles here */
            body {
              font-family: Arial, sans-serif;
            }
            .bill-container {
              width: 100%;
              margin: auto;
            }
            /* Add more styles as needed */
          </style>
        </head>
        <body>
          ${billHTML}
        </body>
      </html>
    `);

    printWindow.document.addEventListener('DOMContentLoaded', () => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    });
  };

  const handleCreateStore = async () => {
    if (newStoreName.trim() === '') {
      setError('Store name cannot be empty');
      return;
    }

    const newStore = await database.addStore(newStoreName);
    setStore(newStore);
    setNewStoreName('');
    setError(null);
  };

  const displayedProducts = showMore ? products : products.slice(0, 10);

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Store Management App
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        {store ? (
          <div>
            <Typography variant="h4" component="h2" gutterBottom>
              Welcome to {store.name}
            </Typography>
            <Box my={3}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Search Products"
                    value={searchTerm}
                    onChange={(e) =>{ 
                      setSearchTerm(e.target.value)
                      setError(null)
                      handleSearch(e.target.value)
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Box>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Box my={3}>
              <Typography variant="h5">Recent Searches</Typography>
              <List>
                {recentSearches.map((search, index) => (
                  <ListItem
                    button
                    key={index}
                    onClick={() => setSearchTerm(search)}
                  >
                    {search}
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box my={3}>
              <Typography variant="h5">Product List</Typography>
              <ProductList products={displayedProducts} onAddToBill={handleAddToBill} />
              {products.length > 10 && (
                <Button
                  variant="outlined"
                  onClick={() => setShowMore(!showMore)}
                  endIcon={<ExpandMore />}
                >
                  {showMore ? 'Show Less' : 'Show More'}
                </Button>
              )}
            </Box>
            <Box my={3} className="bill-container">
              <Typography variant="h5">Bill</Typography>
              <BillReceipt
                billItems={billItems}
                onRemoveFromBill={handleRemoveFromBill}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePrint}
              >
                Print Bill
              </Button>
            </Box>
          </div>
        ) : (
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h4" gutterBottom>
              Create a Store
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Enter store name"
              value={newStoreName}
              onChange={(e) => setNewStoreName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleCreateStore}
            >
              Create Store
            </Button>
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Paper>
        )}
      </Container>
    </React.Fragment>
  );
};

export default HomePage;
