# RFID Inventory Tracking System

A modern, real-time inventory tracking system using RFID technology for efficient asset management.

## 🚀 Features

- **Real-time RFID Tracking**: Track inventory items in real-time using RFID technology
- **Web-based Dashboard**: Modern React-based user interface for inventory management
- **RESTful API**: Comprehensive API for integration with existing systems
- **3D Warehouse Visualization**: Interactive 3D view of warehouse and item locations
- **Multi-zone Support**: Manage inventory across multiple storage zones
- **Audit Trail**: Complete tracking of item movements and user actions
- **Bulk Operations**: Import/export capabilities for large-scale inventory management
- **Mobile Responsive**: Access the system from any device

## 🛠️ Technology Stack

### Frontend
- React 18 with TypeScript
- Three.js for 3D visualization
- Socket.io for real-time updates
- Modern UI with responsive design

### Backend
- Node.js with Express
- TypeScript for type safety
- PostgreSQL database
- Socket.io for WebSocket connections
- JWT authentication

### RFID Integration
- Support for Zebra FX9600 fixed readers
- Nordic ID handheld scanner compatibility
- MQTT protocol for device communication
- Real-time location tracking

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn package manager

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/GABRIELS562/rfid-inventory-tracking.git
cd rfid-inventory-tracking
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database and configuration settings
```

4. Set up the database:
```bash
npm run db:create
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3005
- Backend API: http://localhost:3001

## 🏗️ Project Structure

```
rfid-inventory-tracking/
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── services/        # API and business logic
│   ├── routes/          # Express API routes
│   ├── database/        # Database configuration
│   ├── middleware/      # Express middleware
│   └── utils/           # Utility functions
├── public/              # Static assets
├── package.json         # Project dependencies
└── tsconfig.json        # TypeScript configuration
```

## 🔑 Key Features

### Real-time Tracking
- Live updates of item locations
- Movement history and patterns
- Zone-based inventory management

### Dashboard Analytics
- Inventory statistics
- Activity monitoring
- Storage utilization metrics
- Real-time alerts

### API Endpoints
- `GET /api/inventory` - List all inventory items
- `POST /api/inventory` - Add new items
- `PUT /api/inventory/:id` - Update item details
- `DELETE /api/inventory/:id` - Remove items
- `GET /api/tracking/live` - Real-time tracking data
- `POST /api/import` - Bulk import items

## 🚦 Running Tests

```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage
```

## 🐳 Docker Support

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Gabriel - [@GABRIELS562](https://github.com/GABRIELS562)

Project Link: [https://github.com/GABRIELS562/rfid-inventory-tracking](https://github.com/GABRIELS562/rfid-inventory-tracking)

## 🙏 Acknowledgments

- RFID hardware integration inspired by industry best practices
- React Three Fiber for 3D visualization capabilities
- Socket.io for real-time communication