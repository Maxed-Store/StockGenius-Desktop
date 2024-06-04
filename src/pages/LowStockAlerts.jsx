import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
import db from '../database/database'; 

const LowStockAlerts = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      const products = await db.checkLowStock();
      setLowStockProducts(products);
    };
    fetchLowStockProducts();
  }, []);

  return (
    <div>
      <Typography variant="h5" gutterBottom>Low Stock Alerts</Typography>
      <List>
        {lowStockProducts.map((product) => (
          <ListItem key={product.id}>
            <ListItemText primary={product.name} secondary={`Quantity: ${product.quantity}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default LowStockAlerts;
