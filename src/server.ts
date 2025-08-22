/**
 * Mock Server for RFID Tracking Showcase
 * Minimal server just to serve the application
 */

import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'RFID Tracking System Showcase Server',
    timestamp: new Date().toISOString()
  });
});

// Mock API endpoint
app.get('/api/*', (req, res) => {
  res.json({ 
    message: 'This is a showcase application. All data is simulated.',
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`
    🚀 RFID Tracking System Showcase Server
    📡 Server running on port ${PORT}
    🎨 This is a demonstration version
    📊 All data is simulated for portfolio purposes
  `);
});

export default app;