import React, { useState, useEffect } from 'react';
import { getPredictions } from '../utils/api';
import { useError } from '../contexts/ErrorContext';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Box,
} from '@mui/material';

const PredictionList = () => {
  const { showError } = useError();
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await getPredictions();
        setPredictions(response.data);
      } catch (error) {
        const errorMessage = error.showMessage || error.message;
        showError(errorMessage);
        console.error('Error fetching predictions:', error);
      }
    };
    fetchPredictions();
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Predictions
      </Typography>
      <Paper>
        <List>
          {predictions.map((prediction) => (
            <ListItem key={prediction.id} divider>
              <ListItemText
                primary={`${prediction.predictor} - ${prediction.asset}`}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      Prediction: {prediction.predicted_price_min} - {prediction.predicted_price_max}
                    </Typography>
                    <br />
                    Status: {prediction.status}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default PredictionList;
