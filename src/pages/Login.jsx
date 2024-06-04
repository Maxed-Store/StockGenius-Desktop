import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import db from '../database/database';
import { useNavigate } from 'react-router-dom';


const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async () => {
    setError('');

    try {
      const user = await db.authenticateUser(username, password);
      if (user) {
        onLogin(user);
        setIsAuthenticated(true);
      } else {
        setError('Invalid username or password');
      }
    } catch (e) {
      setError('An error occurred during login');
    }

  };
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  if (user) {
    navigate('/');
    return null;
  }


  return (

    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Login
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
          onClick={handleLogin}
        >
          Login
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => navigate('/register')}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default Login;