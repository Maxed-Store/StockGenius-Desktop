import React, { useState } from 'react';
import { Button, Paper, TextField, Typography } from '@mui/material';
import { purple } from '@mui/material/colors';

const CreateStoreForm = ({ newStore, setNewStore, handleCreateStore, error }) => {
  const [errors, setErrors] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
  });

  const validateName = (name) => name.trim() !== '';
  const validateAddress = (address) => address.trim() !== '';
  const validatePhoneNumber = (phoneNumber) => /^\d{12}$/.test(phoneNumber); 
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleChange = (field, value) => {
   
    setNewStore({ ...newStore, [field]: value });


    let isValid = true;
    switch (field) {
      case 'name':
        isValid = validateName(value);
        break;
      case 'address':
        isValid = validateAddress(value);
        break;
      case 'phoneNumber':
        isValid = validatePhoneNumber(value);
        break;
      case 'email':
        isValid = validateEmail(value);
        break;
      default:
        break;
    }
    setErrors({ ...errors, [field]: isValid ? '' : `Invalid ${field}` });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create a Store
      </Typography>
      {/* Each TextField now has error and helperText props */}
      <TextField
        fullWidth
        variant="outlined"
        label="Enter store name"
        value={newStore.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={!!errors.name}
        helperText={errors.name}
        sx={{ mb: 2 }}
        InputProps={{
          style: { backgroundColor: purple[100] },
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Enter store address"
        value={newStore.address}
        onChange={(e) => handleChange('address', e.target.value)}
        error={!!errors.address}
        helperText={errors.address}
        sx={{ mb: 2 }}
        InputProps={{
          style: { backgroundColor: purple[100] },
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Enter store phone number"
        value={newStore.phoneNumber}
        onChange={(e) => handleChange('phoneNumber', e.target.value)}
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber}
        sx={{ mb: 2 }}
        InputProps={{
          style: { backgroundColor: purple[100] },
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Enter store email"
        value={newStore.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        sx={{ mb: 2 }}
        InputProps={{
          style: { backgroundColor: purple[100] },
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
        disabled={Object.values(errors).some((error) => error !== '')} 
      >
        Create Store
      </Button>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
};

export default CreateStoreForm;