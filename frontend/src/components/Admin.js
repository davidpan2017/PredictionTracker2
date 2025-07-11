import React, { useState, useEffect } from 'react';
import getBackendUrl from '../utils/getBackendUrl';
import { Button, Box, Typography, Paper, TextField } from '@mui/material';

const Admin = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);

  const getApiKey = async () => {
    setLoading(true);
    const backendUrl = getBackendUrl();
    try {
      const response = await fetch(`${backendUrl}/api/api-key`, {
        // Assuming you have a way to authenticate the user and send a token
        // headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setApiKey(data.apiKey);
      } else {
        alert(data.message || 'Failed to get API key');
      }
    } catch (error) {
      console.error('Error getting API key:', error);
      alert('An error occurred while fetching the API key.');
    }
    setLoading(false);
  };

  useEffect(() => {
    // Fetch the key when the component mounts if the user already has one
    getApiKey();
  }, []);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin - API Key
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Your API Key</Typography>
        <TextField
          value={apiKey}
          fullWidth
          variant="outlined"
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />
        <Button variant="contained" onClick={getApiKey} disabled={loading}>
          {loading ? 'Loading...' : 'Request/View API Key'}
        </Button>
      </Paper>
    </Box>
  );
};

export default Admin;
