// API configuration for demo purposes
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
export const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';

export const buildApiUrl = (path: string) => {
  return `${API_URL}${path}`;
};