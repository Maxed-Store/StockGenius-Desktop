import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box } from '@mui/material';
import { Home as HomeIcon, Inventory as InventoryIcon, ShoppingCart as ShoppingCartIcon, Assessment as AssessmentIcon, People as PeopleIcon, Storage as StorageIcon, EditNotificationsTwoTone, EditAttributesOutlined } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import BorderColorIcon from '@mui/icons-material/BorderColor';
const Sidebar = ({ activeLink, handleLinkClick, drawerWidth }) => {
  return (
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
          <ListItem button component={NavLink} to="/addproducts" selected={activeLink === '/addproducts'} onClick={() => handleLinkClick('/addproducts')}>
            <ListItemIcon>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText primary="Add Products" />
          </ListItem>
          <ListItem button component={NavLink} to="/edit-products" selected={activeLink === '/edit-products'} onClick={() => handleLinkClick('/edit-products')}>
            <ListItemIcon>
              <BorderColorIcon />
            </ListItemIcon>
            <ListItemText primary="Edit Products" />
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
          <ListItem button component={NavLink} to="/backup-and-restore" selected={activeLink === '/backup-and-restore'} onClick={() => handleLinkClick('/backup-and-restore')}>
            <ListItemIcon>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText primary="Backup and Restore" />
          </ListItem>
          <ListItem button component={NavLink} to="/low-stock-alerts" selected={activeLink === '/low-stock-alerts'} onClick={() => handleLinkClick('/low-stock-alerts')}>
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Low Stock Alerts" />
          </ListItem>
          <ListItem button component={NavLink} to="/supplier-management" selected={activeLink === '/supplier-management'} onClick={() => handleLinkClick('/supplier-management')}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Supplier Management" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
