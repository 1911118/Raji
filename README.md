# Rajdelver - Grocery Delivery Platform

A full-stack grocery delivery platform built with Node.js, Express, MongoDB, and modern web technologies.

## Features

- Customer ordering system
- Shop management interface
- Delivery agent tracking
- Real-time order updates
- Secure authentication
- Responsive design

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rajdelver.git
   cd rajdelver
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB locally**
   - Install MongoDB Community Edition
   - Start MongoDB service
   - The app will connect to `mongodb://localhost:27017/rajdelver`

4. **Environment Variables**
   Create a `.env` file in the root directory:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/rajdelver
   JWT_SECRET=your_jwt_secret
   ```

5. **Initialize the database**
   ```bash
   npm run init-db
   ```

6. **Start the development server**
   ```bash
   npm start
   ```

## Test Accounts

- **Customer**
  - Email: customer@example.com
  - Password: customer123

- **Shop Owner**
  - Email: shop@example.com
  - Password: shop123

- **Delivery Agent**
  - Email: delivery@example.com
  - Password: delivery123

## Project Structure

```
rajdelver/
├── models/          # MongoDB models
├── public/          # Frontend static files
├── scripts/         # Utility scripts
├── server.js        # Main application file
├── package.json     # Project dependencies
└── README.md        # This file
```

## API Endpoints

### Authentication
- POST `/login` - User login
- POST `/register` - User registration

### Products
- GET `/products` - List all products
- POST `/products` - Create product (Shop only)
- PUT `/products/:id` - Update product (Shop only)
- DELETE `/products/:id` - Delete product (Shop only)

### Orders
- POST `/orders` - Create new order (Customer only)
- GET `/orders/:role/:id` - Get orders by role and user ID
- PUT `/orders/:id/status` - Update order status
- GET `/admin/orders/export` - Export orders to CSV (Shop only)

## Development

### Running Tests
```bash
npm run test-website  # Run full website tests
npm run test-db       # Test database connection
```

### Database Management
```bash
npm run init-db      # Initialize database with sample data
npm run scan-db      # Scan database contents
```

## Deployment

### GitHub Pages Setup
1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/rajdelver.git
   git push -u origin main
   ```
3. Enable GitHub Pages in repository settings

### Important Notes
- Keep MongoDB running locally for development
- Never commit sensitive data or environment variables
- Update the README when adding new features

## License

This project is licensed under the MIT License. 