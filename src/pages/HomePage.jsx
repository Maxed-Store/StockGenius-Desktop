import React, { useState, useEffect } from 'react';
import database from '../database/database';
import ProductList from '../components/ProductList.jsx';
import BillReceipt from '../components/BillReceipt.jsx';
import ChangePasswordModal from './ChangePasswordModal.jsx';
import SkeletonLoading from '../components/SkeletonLoading.jsx';
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
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { ExpandMore, CameraAlt, AccountCircle, Email } from '@mui/icons-material';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { purple } from '@mui/material/colors';
import CreateStoreForm from '../components/CreateStoreForm.jsx';
import { ipcRenderer } from 'electron';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'purple',
    color: theme.palette.text.primary,
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeUser: {
    marginRight: theme.spacing(2),
    fontWeight: 400,
  },
  storeName: {
    fontWeight: 600,
  },
  button: {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
  },
}));

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
    phone: '',
    email: '',
  });
  const [showMore, setShowMore] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [continuousScanning, setContinuousScanning] = useState(false);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
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
      setLoading(false);
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

  useEffect(() => {
    database.scheduleAutomatedBackup();
  }, []);

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
    try {
      const searchResults = await database.searchProductsByBarcode(barcode);
      if (searchResults.length === 0) {
        setError('No products found');
      } else {
        setError(null);
        setProducts((prevProducts) => [...prevProducts, ...searchResults]);
        setBillItems((prevBillItems) => [...prevBillItems, ...searchResults]);
        await database.addRecentSearch(storeId, searchTerm);
        setRecentSearches((prevSearches) => {
          const updatedSearches = [...prevSearches, searchTerm];
          return updatedSearches.slice(-10);
        });
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

  const handlePrint = async () => {
    // Update the product quantities in the database
    for (const item of billItems) {
      const product = await database.getProductById(item.id);
      if (product) {
        const newQuantity = product.quantity - 1; // Assuming quantity sold is always 1
        await database.updateProductQuantity(item.id, newQuantity);
      }
    }

    // Open a new window for printing the bill
    const printWindow = window.open('', '_blank');
    const billHTML = document.querySelector('.bill-receipt').outerHTML;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <style>
            body {
              font-family: Courier, monospace;
            }
            .bill-receipt {
              width: 100%;
              margin: auto;
              max-width: 400px;
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
            button {
              display: none;
            }
          </style>
        </head>
        <body>
          ${billHTML}
        </body>
      </html>
    `);
    ipcRenderer.send('print-bill', document.querySelector('.bill-receipt').outerHTML);
  };
  const handleAddToBillChecked = (product) => {
    const productInBill = billItems.filter(item => item.name === product.name).length;
    const productInStore = products.find(item => item.name === product.name);
  
    if (productInBill < productInStore.quantity) {
      handleAddToBill(product);
    } else {
      alert('No more products available');
    }
  };
  


  const handleCreateStore = async () => {
    if (newStore.name.trim() === '') {
      setError('Store name cannot be empty');
      return;
    }

    const newStorelocal = await database.addStore(newStore.name, newStore.address, newStore.phone, newStore.email);
    setStore(newStorelocal);
    setNewStore({
      name: '',
      address: '',
      phone: '',
      email: '',
    });
    setError(null);
  };

  const handleSell = async () => {
    try {
      for (let item of billItems) {
        await database.updateProductQuantity(item.id, item.quantity - 1);
      }
      setBillItems([]);
      alert('Sale successful! Products updated.');
    } catch (error) {
      console.error('Error during sale:', error);
      alert('An error occurred during the sale.');
    }
  };

  const displayedProducts = showMore ? products : products.slice(0, 10);
  if (loading) {
    return <SkeletonLoading />;
  }

  return (
    <React.Fragment>
      <Container>
        {store ? (
          <Box my={4} mt={4}>
            <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'purple' }}>
              <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Welcome, {user.username}! to {store.name}
                </Typography>

                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => { handleOpenChangePasswordModal(); }}>Change Password</MenuItem>
                  <MenuItem onClick={() => { handleClose(); onLogout(); }}>Logout</MenuItem>
                </Menu>
              </Toolbar>
            </AppBar>
            <Box my={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8} md={9}>
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
                <Grid item xs={12} sm={4} md={3}>
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
                    onClick={() => {
                      setContinuousScanning(!continuousScanning)
                      setScanning(!scanning)
                    }
                    }
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
              <ProductList products={displayedProducts} onAddToBill={handleAddToBillChecked} />
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
              <Box my={3} className="bill-receipt">
                <BillReceipt
                  billItems={billItems}
                  onRemoveFromBill={handleRemoveFromBill}
                  store={store}
                  onPrint={handlePrint}
                />
              </Box>
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
          <CreateStoreForm
            newStore={newStore}
            setNewStore={setNewStore}
            handleCreateStore={handleCreateStore}
            error={error}
          />
        )}
      </Container>
      {openChangePasswordModal && (
        <ChangePasswordModal
          open={openChangePasswordModal}
          onClose={handleCloseChangePasswordModal}
          user={user}
        />
      )
      }
    </React.Fragment>
  );
};


export default HomePage;
