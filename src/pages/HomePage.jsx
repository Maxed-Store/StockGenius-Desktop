import React, { useState, useEffect } from 'react';
import database from '../database/database';
import ProductList from '../components/ProductList.jsx';
import BillReceipt from '../components/BillReceipt.jsx';
import ChangePasswordModal from './ChangePasswordModal.jsx';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  List,
  ListItem,
  Grid,
  Paper,
  Box,
  CssBaseline,
  Collapse,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { ExpandMore, CameraAlt } from '@mui/icons-material';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { purple } from '@mui/material/colors';

const HomePage = ({ storeId = 1, user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [error, setError] = useState(null);
  const [store, setStore] = useState(null);
  const [newStore, setNewStore] = useState({
    name: '',
    address: '',
    phoneNumber: ''
  });
  const [showMore, setShowMore] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [continuousScanning, setContinuousScanning] = useState(false);

  const handleOpenChangePasswordModal = () => {
    setOpenChangePasswordModal(true);
  };

  const handleCloseChangePasswordModal = () => {
    setOpenChangePasswordModal(false);
  };

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

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      return;
    }

    try {
      const searchResults = await database.searchProducts(searchTerm);
      if (searchResults.length === 0) {
        setError('No products found');
      } else {
        setError(null);
        setProducts(searchResults);
        await database.addRecentSearch(storeId, searchTerm);
        setRecentSearches((prevSearches) => {
          const updatedSearches = [...prevSearches, searchTerm];
          return updatedSearches.slice(-10);
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBarcodeScan = async (barcode) => {
    console.log('Scanned barcode:', barcode);
    try {
      const searchResults = await database.searchProductsByBarcode(barcode);
      console.log('Search results:', searchResults);
      if (searchResults.length === 0) {
        setError('No products found');
      } else {
        setError(null);
        setProducts((prevProducts) => [...prevProducts, ...searchResults]);
        setBillItems((prevBillItems) => [...prevBillItems, ...searchResults]);
      }
    } catch (err) {
      setError(err.message);
    }

    if (continuousScanning) {
      setTimeout(() => {
        setScanning(true);
      }, 500);
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
           body {
             font-family: Arial, sans-serif;
           }
           .bill-container {
             width: 100%;
             margin: auto;
           }
           .bill-header, .bill-footer {
             text-align: center;
           }
           .bill-items {
             width: 100%;
             border-collapse: collapse;
           }
           .bill-items th, .bill-items td {
             border: 1px solid #ddd;
             padding: 8px;
           }
           .bill-items th {
             background-color: #f2f2f2;
             text-align: left;
           }
           .total-amount {
             font-weight: bold;
           }
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
    if (newStore.name.trim() === '') {
      setError('Store name cannot be empty');
      return;
    }

    const newStore = await database.addStore(newStore.name);
    setStore(newStore);
    setNewStore({
      name: '',
      address: '',
      phoneNumber: ''
    });
    setError(null);
  };

  const displayedProducts = showMore ? products : products;

  return (
    <React.Fragment>
      <div>
        <h1>Welcome, {user.username}!</h1>
        <Button onClick={handleOpenChangePasswordModal} color="secondary">Change Password</Button>
        <ChangePasswordModal
          user={user}
          open={openChangePasswordModal}
          onClose={handleCloseChangePasswordModal}
        />
      </div>
      <AppBar position="static" style={{ backgroundColor: purple[500] }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Store Management App
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        {store ? (
          <Box my={4}>
            <Typography variant="h4" component="h2" gutterBottom>
              Welcome to {store.name}
            </Typography>
            <Box my={3}>
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    color='secondary'
                    label="Search Products"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setError(null);
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setScanning(!scanning)}
                            edge="end"
                            color="secondary"
                          >
                            <CameraAlt />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Box mb={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={handleSearch}
                      sx={{ height: '50px', width: '100%' }}
                    >
                      Search
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    color={continuousScanning ? 'error' : 'secondary'}
                    onClick={() => setContinuousScanning(!continuousScanning)}
                    sx={{ height: '50px', width: '100%' }}
                  >
                    {continuousScanning ? 'Stop Continuous Scanning' : 'Start Continuous Scanning'}
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
              <Paper elevation={3} sx={{ maxHeight: 200, overflow: 'auto' }}>
                <List>
                  {recentSearches.map((search, index) => (
                    <ListItem
                      button
                      key={index}
                      onClick={() => {
                        setSearchTerm(search);
                        handleSearch();
                      }}
                    >
                      {search}
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
            <Box my={3}>
              <Typography variant="h5">Product List</Typography>
              <ProductList products={displayedProducts} onAddToBill={handleAddToBill} />
              {products.length > 10 && (
                <Button
                  variant="outlined"
                  onClick={() => setShowMore(!showMore)}
                  endIcon={<ExpandMore />}
                  style={{ color: purple[500] }}
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
                sx={{ mt: 2 }}
              >
                Print Bill
              </Button>
            </Box>
            {scanning && (
              <BarcodeScannerComponent
                width={500}
                height={500}
                onUpdate={(err, result) => {
                  if (result) {
                    handleBarcodeScan(result.text);
                  }
                }}
                onScan={(result) => {
                  if (continuousScanning) {
                    handleBarcodeScan(result);
                  }
                }}
              />
            )}
          </Box>
        ) : (
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h4" gutterBottom>
              Create a Store
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Enter store name"
              value={newStore.name}
              onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
              sx={{ mb: 2 }}
              InputProps={{
                style: { backgroundColor: purple[100] }
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Enter store address"
              value={newStore.address}
              onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
              sx={{ mb: 2 }}
              InputProps={{
                style: { backgroundColor: purple[100] }
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Enter store phone number"
              value={newStore.phoneNumber}
              onChange={(e) => setNewStore({ ...newStore, phoneNumber: e.target.value })}
              sx={{ mb: 2 }}
              InputProps={{
                style: { backgroundColor: purple[100] }
              }}
            />
            <Typography variant="body2" sx={{ mb: 2 }}>
              You need to create a store before you can start using the app.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
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