import React, { useState } from 'react';
import { login } from '../utils/api';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData.email, formData.password);
      console.log(response.data);
      alert('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Error logging in:', error);
      alert(`Login failed: ${error.message}`);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        mx: 'auto',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <TextField
        name="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="contained">
        Login
      </Button>
      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
        <Link to="/">Back to Home</Link>
      </Typography>
    </Box>
  );
};

export default Login;
