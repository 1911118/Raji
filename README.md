# Rajdelver - Grocery Delivery Platform

A full-stack grocery delivery web application with real-time order tracking and separate dashboards for customers, shop owners, and delivery agents.

## Features

- User authentication with role-based access (Customer, Shop, Delivery)
- Real-time order tracking using Socket.IO
- Product management for shop owners
- Order management and status updates
- CSV export for order history
- Mobile-friendly responsive design

## Tech Stack

- Backend: Node.js + Express
- Database: MongoDB
- Real-time: Socket.IO
- Frontend: HTML, CSS, JavaScript
- Authentication: JWT

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd rajdelver
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

4. Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### Customer Portal
- Access at `http://localhost:3000/customer`
- Register/Login as a customer
- Browse products and add to cart
- Place orders with 6-digit pin code
- Track order status in real-time

### Shop Dashboard
- Access at `http://localhost:3000/shop`
- Register/Login as a shop owner
- Manage products (add, update, delete)
- View and manage orders
- Export order history to CSV

### Delivery Dashboard
- Access at `http://localhost:3000/delivery`
- Register/Login as a delivery agent
- View assigned orders
- Update order status (on-the-way, delivered)

## API Endpoints

### Authentication
- POST `/register` - Register new user
- POST `/login` - User login

### Products
- GET `/products` - Get all products
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