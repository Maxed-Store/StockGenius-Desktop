import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText, TextField, Button, Grid, CircularProgress, Alert, Box } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { makeStyles } from '@material-ui/core/styles';
import db from '../database/database'; 

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
  },
  list: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(2),
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  warningIcon: {
    color: theme.palette.error.main,
    marginRight: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  alert: {
    marginTop: theme.spacing(2),
  },
}));

const LowStockAlerts = ({ initialThreshold = 5 }) => {
  const classes = useStyles();
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [currentThreshold, setCurrentThreshold] = useState(initialThreshold);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchLowStockProducts = async (threshold) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const products = await db.checkLowStock(threshold);
      setLowStockProducts(products);
      if (products.length === 0) {
        setSuccessMessage('No products below the specified threshold');
      } else {
        setSuccessMessage('Products fetched successfully');
      }
    } catch (err) {
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockProducts(5);
  }, []);

  const handleThresholdChange = (event) => {
    setCurrentThreshold(event.target.value);
  };

  const handleThresholdSubmit = (event) => {
    event.preventDefault();
    fetchLowStockProducts(Number(currentThreshold));
  };

  return (
    <div className={classes.container}>
      <Typography variant="h5" gutterBottom>Low Stock Alerts</Typography>
      <form onSubmit={handleThresholdSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="Stock Threshold"
              type="number"
              fullWidth
              color="secondary"
              value={currentThreshold}
              onChange={handleThresholdChange}
              variant="outlined"
              className={classes.textField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              className={classes.button}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Update Threshold'}
            </Button>
          </Grid>
        </Grid>
      </form>
      {loading && <CircularProgress />}
      {error && <Alert severity="error" className={classes.alert}>{error}</Alert>}
      {successMessage && <Alert severity="success" className={classes.alert}>{successMessage}</Alert>}
      <List className={classes.list}>
        {lowStockProducts.map((product) => (
          <ListItem key={product.id} className={classes.listItem}>
            <WarningIcon className={classes.warningIcon} />
            <ListItemText primary={product.name} secondary={`Quantity: ${product.quantity}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default LowStockAlerts;
