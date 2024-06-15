import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const StockManagementInfo = () => {
  const [productKey, setProductKey] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleProductKeyChange = (event) => {
    setProductKey(event.target.value);
  };

  const verifyProductKey = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/verifyProductKey', { productKey });
      setVerificationResult(response.data.isValid);
      setLoading(false);
    } catch (error) {
      setError('Failed to verify product key. Please try again later.');
      setVerificationResult(null);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Local Stock Management Features
      </Typography>
      <Typography variant="body1" paragraph>
        Our stock management system offers a comprehensive range of features to help you efficiently manage your inventory:
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Real-time stock level updates" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Automatic reorder notifications" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Detailed inventory reports" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Batch and expiry date tracking" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Supplier management" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Customizable stock alerts" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Sales and purchase order management" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Multi-location inventory tracking" />
        </ListItem>
      </List>
      <Typography variant="body1" paragraph>
        Please enter your product key to verify your purchase and unlock the full features.
      </Typography>
      <TextField
        label="Product Key"
        variant="outlined"
        fullWidth
        value={productKey}
        onChange={handleProductKeyChange}
        sx={{ mb: 2 }}
        disabled={loading}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={verifyProductKey}
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify Product Key'}
      </Button>
      {verificationResult !== null && (
        verificationResult ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            Product key verified! You have access to all features.
          </Alert>
        ) : (
          <Alert severity="error" sx={{ mt: 2 }}>
            Invalid product key. Please try again.
          </Alert>
        )
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default StockManagementInfo;
