import React, { useState } from 'react';
import { submitPrediction } from '../utils/api';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    source_type: 'YouTube',
    link: '',
    predictor: '',
    asset: 'BTC',
    current_price: '',
    predicted_price_min: '',
    predicted_price_max: '',
    time_frame_days: '',
    prediction_type: '方向',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await submitPrediction(formData);
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting prediction:', error);
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
        maxWidth: 500,
        mx: 'auto',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        New Prediction
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Source Type</InputLabel>
        <Select
          name="source_type"
          value={formData.source_type}
          onChange={handleChange}
        >
          <MenuItem value="YouTube">YouTube</MenuItem>
          <MenuItem value="X">X</MenuItem>
          <MenuItem value="自己">自己</MenuItem>
        </Select>
      </FormControl>
      <TextField
        name="link"
        label="Link"
        value={formData.link}
        onChange={handleChange}
      />
      <TextField
        name="predictor"
        label="Predictor"
        value={formData.predictor}
        onChange={handleChange}
        required
      />
      <FormControl fullWidth>
        <InputLabel>Asset</InputLabel>
        <Select name="asset" value={formData.asset} onChange={handleChange}>
          <MenuItem value="BTC">BTC</MenuItem>
          <MenuItem value="ETH">ETH</MenuItem>
          <MenuItem value="NVDA">NVDA</MenuItem>
          <MenuItem value="TSLA">TSLA</MenuItem>
        </Select>
      </FormControl>
      <TextField
        name="current_price"
        label="Current Price"
        type="number"
        value={formData.current_price}
        onChange={handleChange}
      />
      <TextField
        name="predicted_price_min"
        label="Predicted Price (Min)"
        type="number"
        value={formData.predicted_price_min}
        onChange={handleChange}
      />
      <TextField
        name="predicted_price_max"
        label="Predicted Price (Max)"
        type="number"
        value={formData.predicted_price_max}
        onChange={handleChange}
      />
      <TextField
        name="time_frame_days"
        label="Time Frame (Days)"
        type="number"
        value={formData.time_frame_days}
        onChange={handleChange}
      />
      <FormControl fullWidth>
        <InputLabel>Prediction Type</InputLabel>
        <Select
          name="prediction_type"
          value={formData.prediction_type}
          onChange={handleChange}
        >
          <MenuItem value="方向">方向</MenuItem>
          <MenuItem value="区间">区间</MenuItem>
          <MenuItem value="策略型">策略型</MenuItem>
        </Select>
      </FormControl>
      <TextField
        name="description"
        label="Description"
        multiline
        rows={4}
        value={formData.description}
        onChange={handleChange}
      />
      <Button type="submit" variant="contained">
        Submit Prediction
      </Button>
    </Box>
  );
};

export default PredictionForm;
