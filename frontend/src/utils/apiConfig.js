const API_KEY_STORAGE_KEY = 'prediction_tracker_api_key';

export const getApiKey = () => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const setApiKey = (key) => {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
};

export const clearApiKey = () => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};

export const getApiHeaders = () => {
  const apiKey = getApiKey();
  return apiKey ? { 'x-api-key': apiKey } : {};
};
