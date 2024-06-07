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
import BackupAndRestore from './pages/BackUpAndRestore.jsx';
import LowStockAlerts from './pages/LowStockAlerts.jsx';
import SupplierManagement from './pages/SupplierManagement.jsx';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Box } from '@mui/material';
import './index.css';
import db from './database/database';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Sidebar from './components/Sidebar.jsx';
import ProductManagement from './pages/ProductManagement.jsx';

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
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'purple' }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              MaxStore Local
            </Typography>
          </Toolbar>
        </AppBar>
        {isAuthenticated && (
          <Sidebar activeLink={activeLink} handleLinkClick={handleLinkClick} drawerWidth={drawerWidth} />
        )}
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
          <Toolbar />
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><HomePage user={user} onLogout={handleLogout} /></ProtectedRoute>} />
            <Route path="/addproducts" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProductsPage user={user} /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CustomersPage user={user} /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute isAuthenticated={isAuthenticated}><InventoryPage user={user} /></ProtectedRoute>} />
            <Route path="/sales" element={<ProtectedRoute isAuthenticated={isAuthenticated}><SalesPage user={user} /></ProtectedRoute>} />
            <Route path="/sales-report" element={<ProtectedRoute isAuthenticated={isAuthenticated}><SalesReportPage storeId={1} user={user} /></ProtectedRoute>} />
            <Route path="/user-management" element={<ProtectedRoute isAuthenticated={isAuthenticated}><UserManagement user={user} handleLogout={handleLogout} /></ProtectedRoute>} />
            <Route path="/backup-and-restore" element={<ProtectedRoute isAuthenticated={isAuthenticated}><BackupAndRestore /></ProtectedRoute>} />
            <Route path="/low-stock-alerts" element={<ProtectedRoute isAuthenticated={isAuthenticated}><LowStockAlerts /></ProtectedRoute>} />
            <Route path="/supplier-management" element={<ProtectedRoute isAuthenticated={isAuthenticated}><SupplierManagement /></ProtectedRoute>} />
            <Route path="/edit-products" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProductManagement /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

        </Box>
      </Box>
    </Router>
  );
}

export default App;
