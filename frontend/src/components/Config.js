import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const Config = () => {
  const [backendUrl, setBackendUrl] = useState('');

  useEffect(() => {
    const storedUrl = localStorage.getItem('backendUrl');
    if (storedUrl) {
      setBackendUrl(storedUrl);
    } else {
      setBackendUrl('http://localhost:5000');
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('backendUrl', backendUrl);
    alert('Backend URL saved!');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 500,
        mx: 'auto',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Configuration
      </Typography>
      <TextField
        label="Backend URL"
        value={backendUrl}
        onChange={(e) => setBackendUrl(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handleSave}>
        Save
      </Button>
    </Box>
  );
};

export default Config;
