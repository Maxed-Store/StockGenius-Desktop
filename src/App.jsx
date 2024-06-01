import React, { useState } from 'react';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import SalesPage from './pages/SalesPage.jsx';
import SalesReportPage from './pages/SalesReportPage.jsx';
import CustomersPage from './pages/CustomersPage.jsx';
import InventoryPage from './pages/InventoryPage.jsx';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Box } from '@mui/material';
import { Home as HomeIcon, Inventory as InventoryIcon, ShoppingCart as ShoppingCartIcon, Assessment as AssessmentIcon, People as PeopleIcon, Storage as StorageIcon } from '@mui/icons-material';
import './index.css';

const drawerWidth = 240;

function App() {
  const [activeLink, setActiveLink] = useState('/');

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              MaxStore Local
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItem button component={NavLink} to="/" selected={activeLink === '/'} onClick={() => handleLinkClick('/')}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button component={NavLink} to="/products" selected={activeLink === '/products'} onClick={() => handleLinkClick('/products')}>
                <ListItemIcon>
                  <StorageIcon />
                </ListItemIcon>
                <ListItemText primary="Products" />
              </ListItem>
              <ListItem button component={NavLink} to="/sales" selected={activeLink === '/sales'} onClick={() => handleLinkClick('/sales')}>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Sales" />
              </ListItem>
              <ListItem button component={NavLink} to="/sales-report" selected={activeLink === '/sales-report'} onClick={() => handleLinkClick('/sales-report')}>
                <ListItemIcon>
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText primary="Sales Report" />
              </ListItem>
              <ListItem button component={NavLink} to="/customers" selected={activeLink === '/customers'} onClick={() => handleLinkClick('/customers')}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Customers" />
              </ListItem>
              <ListItem button component={NavLink} to="/inventory" selected={activeLink === '/inventory'} onClick={() => handleLinkClick('/inventory')}>
                <ListItemIcon>
                  <InventoryIcon />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
          <Toolbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/sales-report" element={<SalesReportPage storeId={1} />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
