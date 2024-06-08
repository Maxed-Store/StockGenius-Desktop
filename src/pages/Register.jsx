import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import db from '../database/database';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();



  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("one lowercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("one digit");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push("one special character (!@#$%^&*)");
    }

    if (errors.length > 0) {
      return "Password must contain " + errors.join(", ") + ".";
    }
    return "";
  };
  const handleRegister = async () => {
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Proceed with registration if there's no error
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
          color="secondary"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          type="password"
          color="secondary"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={handleRegister}
          style={{ marginBottom: '10px' }}
        >
          Register
        </Button>
        <Button
          fullWidth
          variant="outlined"
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