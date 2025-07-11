import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorProvider } from './contexts/ErrorContext';
import PredictionForm from './components/PredictionForm';
import PredictionList from './components/PredictionList';
import Login from './components/Login';
import Register from './components/Register';
import Config from './components/Config';
import Admin from './components/Admin';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ErrorProvider>
      <Router>
        <Layout>
          <Routes>
          <Route path="/" element={<PredictionList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/new" element={<ProtectedRoute><PredictionForm /></ProtectedRoute>} />
          <Route path="/config" element={<ProtectedRoute><Config /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>
          </Layout>
        </Router>
      </ErrorProvider>
  );
}

export default App;
