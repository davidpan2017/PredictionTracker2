import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

// Dummy user context for demonstration. Replace with your actual auth context.
const getUser = () => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  return token && username ? { username } : null;
};

const TopBar = () => {
  const user = getUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Prediction Tracker
        </Typography>
        {user && (
          <>
            <IconButton onClick={handleMenu} color="inherit">
              <Avatar>{user.username[0].toUpperCase()}</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem disabled>{user.username}</MenuItem>
              <MenuItem component={Link} to="/my-predictions" onClick={handleClose}>My Predictions</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
