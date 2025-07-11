import React, { useState } from 'react';
import { register } from '../utils/api';
import { TextField, Button, Box, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    password: '',
    confirm_password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(
        formData.email,
        formData.first_name,
        formData.password,
        formData.confirm_password
      );
      // Save username for TopBar display after login
      localStorage.setItem('username', formData.first_name);
      console.log(response.data);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registration failed: ' + (error.message || 'Unknown error'));
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
        Register
      </Typography>
      <TextField
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <TextField
        name="first_name"
        label="Username"
        value={formData.first_name}
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
      <TextField
        name="confirm_password"
        label="Confirm Password"
        type="password"
        value={formData.confirm_password}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="contained">
        Register
      </Button>
      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
        <Link to="/">Back to Home</Link>
      </Typography>
    </Box>
  );
};

export default Register;
