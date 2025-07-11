# Prediction Tracking System

## System Overview

A full-stack application for tracking market predictions with:
- React frontend
- Node.js/Express backend 
- MySQL database
- JWT authentication
- API key management

## Database Schema

### Tables:
1. `users` - Stores user credentials
   - id, username, password (hashed), email, created_at

2. `predictions` - Tracks prediction submissions
   - id, user_id, source_type, link, predictor, asset
   - current_price, predicted_price_min/max, time_frame_days
   - prediction_type, description, status, created_at

3. `app_registrations` - Manages API clients
   - id, app_name, public_key, private_key
   - license_type, max_calls_per_day, is_active

4. `api_call_logs` - Tracks API usage
   - id, app_id, endpoint, called_at

## API Documentation

### Authentication:
- `POST /api/register` - User registration
- `POST /api/login` - User login (returns JWT)

### Predictions:
- `POST /api/predictions` - Submit new prediction
- `GET /api/predictions` - List all predictions  
- `GET /api/predictions/:asset` - Filter by asset

### API Key Management:
- `POST /api/applications/register` - Register new API client
- `GET /api/applications/usage` - Check API usage stats
- `PUT /api/applications/update` - Modify API client
- `POST /api/applications/rotate-keys` - Rotate API keys

## Installation

### Backend:
```bash
cd backend
npm install
npm start
```

### Frontend:
```bash 
cd frontend
npm install
npm start
```

## Configuration

1. Create `.env` file in backend with:
```
JWT_SECRET=your_secret_key
DB_HOST=x.x.x.x  
DB_PORT=3306
DB_USER=predict_admin
DB_PASSWORD=xxxxxx
DB_NAME=predictDB
```

2. Frontend connects to backend via `src/utils/apiConfig.js`

## Features

- User authentication
- Prediction tracking
- API key management
- Rate limiting
- Comprehensive error handling
