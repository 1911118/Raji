# Rajdelver - Grocery Delivery Platform

A full-stack grocery delivery platform with real-time order tracking and management.

## Features

- Customer ordering system
- Shop management interface
- Delivery agent tracking
- Real-time order updates
- MongoDB database integration

## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rajdelver.git
cd rajdelver
```

2. Install dependencies:
```bash
npm install
```

3. Set up MongoDB locally:
- Install MongoDB Community Edition
- Start MongoDB service
- The application will connect to `mongodb://localhost:27017/rajdelver`

4. Create a `.env` file in the root directory:
```
MONGO_URI=mongodb://localhost:27017/rajdelver
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Initialize the database with sample data:
```bash
npm run init-db
```

6. Start the development server:
```bash
npm start
```

## Project Structure

```
rajdelver/
├── models/          # MongoDB models
├── public/          # Frontend static files
├── scripts/         # Utility scripts
├── server.js        # Main server file
└── package.json     # Project configuration
```

## API Endpoints

### Authentication
- POST `/login` - User login
- POST `/register` - User registration

### Products
- GET `/products` - List all products
- POST `/products` - Add new product (Shop only)
- PUT `/products/:id` - Update product (Shop only)
- DELETE `/products/:id` - Delete product (Shop only)

### Orders
- POST `/orders` - Create new order (Customer only)
- GET `/orders/:role/:id` - Get orders by role and user ID
- PUT `/orders/:id/status` - Update order status
- GET `/admin/orders/export` - Export orders to CSV (Shop only)

## Real-time Events

- `newOrder` - Emitted when a new order is placed
- `orderAccepted` - Emitted when an order is accepted
- `statusUpdate` - Emitted when order status changes

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 