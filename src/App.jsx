import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, NavLink, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import SalesPage from './pages/SalesPage.jsx';
import SalesReportPage from './pages/SalesReportPage.jsx';
import CustomersPage from './pages/CustomersPage.jsx';
import InventoryPage from './pages/InventoryPage.jsx';
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Register.jsx';
import UserManagement from './pages/UserManagement.jsx';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Box } from '@mui/material';
import { Home as HomeIcon, Inventory as InventoryIcon, ShoppingCart as ShoppingCartIcon, Assessment as AssessmentIcon, People as PeopleIcon, Storage as StorageIcon } from '@mui/icons-material';
import './index.css';
import db from './database/database';

const drawerWidth = 240;

function App() {
  const [activeLink, setActiveLink] = useState('/');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {

    db.createDefaultAdmin();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
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
        {isAuthenticated && (
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
                <ListItem button component={NavLink} to="/user-management" selected={activeLink === '/user-management'} onClick={() => handleLinkClick('/user-management')}>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="User Management" />
                </ListItem>
              </List>
            </Box>
          </Drawer>
        )}
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
          <Toolbar />
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={isAuthenticated ? <HomePage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
            />
            <Route
              path="/products"
              element={isAuthenticated ? <ProductsPage user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/customers"
              element={isAuthenticated ? <CustomersPage user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/inventory"
              element={isAuthenticated ? <InventoryPage user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/sales"
              element={isAuthenticated ? <SalesPage user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/sales-report"
              element={isAuthenticated ? <SalesReportPage storeId={1} user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/user-management"
              element={isAuthenticated ? <UserManagement user={user} handleLogout={handleLogout} /> : <Navigate to="/login" />}
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;