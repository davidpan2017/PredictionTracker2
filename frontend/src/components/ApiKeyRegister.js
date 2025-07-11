import React, { useState } from 'react';
import { setApiKey } from '../utils/apiConfig';
import { apiRequest } from '../utils/getBackendUrl';

const ApiKeyRegister = () => {
  const [appName, setAppName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [apiKey, setApiKeyState] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('post', '/api/applications/register', {
        app_name: appName,
        license_type: 'free'
      });
      
      setApiKey(response.data.public_key);
      setApiKeyState(response.data.public_key);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data || 'Failed to register application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="api-key-register">
      <h2>Register for API Access</h2>
      {success ? (
        <div className="success-message">
          <p>Your API key has been generated:</p>
          <code>{apiKey}</code>
          <p>This key has been saved automatically.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Application Name</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
      )}
    </div>
  );
};

export default ApiKeyRegister;
