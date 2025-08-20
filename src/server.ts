import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3005',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'RFID Inventory Tracking API',
    timestamp: new Date().toISOString() 
  });
});

// API Routes
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/tracking', require('./routes/tracking'));
app.use('/api/zones', require('./routes/zones'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/import', require('./routes/import'));

// WebSocket connection for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle real-time RFID events
  socket.on('rfid:scan', (data) => {
    // Process RFID scan data
    console.log('RFID scan received:', data);
    
    // Broadcast to all connected clients
    io.emit('inventory:update', {
      itemId: data.tagId,
      location: data.location,
      timestamp: new Date().toISOString()
    });
  });

  // Handle location updates
  socket.on('location:update', (data) => {
    io.emit('location:changed', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 RFID Inventory Tracking Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for real-time connections`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});