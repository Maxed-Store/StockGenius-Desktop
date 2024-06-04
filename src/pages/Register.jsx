import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import db from '../database/database';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await db.addUser(username, password);
      setError('');
      navigate('/login');
    } catch (e) {
      setError('Registration failed');
    }
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <TextField
          fullWidth
          variant="outlined"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleRegister}
        >
          Register
        </Button>
        <Button
          fullWidth
          variant="text"
          color="secondary"
          onClick={() => navigate('/login')}
        >
          Login with existing account
        </Button>

      </Box>
    </Container>
  );
};

export default Register;
