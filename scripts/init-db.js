require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// MongoDB Connection
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rajdelver';

// Sample data
const sampleUsers = [
  {
    name: 'John Customer',
    email: 'customer@example.com',
    password: 'customer123',
    role: 'customer',
    pinCode: '123456'
  },
  {
    name: 'Shop Owner',
    email: 'shop@example.com',
    password: 'shop123',
    role: 'shop',
    pinCode: '234567'
  },
  {
    name: 'Delivery Agent',
    email: 'delivery@example.com',
    password: 'delivery123',
    role: 'delivery',
    pinCode: '345678'
  }
];

const sampleProducts = [
  {
    name: 'Fresh Apples',
    price: 2.99,
    image: 'https://example.com/apples.jpg',
    category: 'Fruits',
    stock: 100
  },
  {
    name: 'Organic Bananas',
    price: 1.99,
    image: 'https://example.com/bananas.jpg',
    category: 'Fruits',
    stock: 150
  },
  {
    name: 'Whole Milk',
    price: 3.49,
    image: 'https://example.com/milk.jpg',
    category: 'Dairy',
    stock: 50
  },
  {
    name: 'Brown Bread',
    price: 2.49,
    image: 'https://example.com/bread.jpg',
    category: 'Bakery',
    stock: 30
  },
  {
    name: 'Fresh Eggs',
    price: 4.99,
    image: 'https://example.com/eggs.jpg',
    category: 'Dairy',
    stock: 60
  }
];

// Function to create sample orders
async function createSampleOrders(customerId, shopId, deliveryId, products) {
  return [
    {
      customerId,
      customerPin: '123456',
      products: [
        { productId: products[0]._id, quantity: 2 },
        { productId: products[1]._id, quantity: 3 }
      ],
      status: 'delivered',
      deliveryId,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    },
    {
      customerId,
      customerPin: '123456',
      products: [
        { productId: products[2]._id, quantity: 1 },
        { productId: products[3]._id, quantity: 2 }
      ],
      status: 'on-the-way',
      deliveryId,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      customerId,
      customerPin: '123456',
      products: [
        { productId: products[4]._id, quantity: 1 }
      ],
      status: 'pending',
      createdAt: new Date() // Today
    }
  ];
}

// Main initialization function
async function initializeDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB successfully');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('Existing data cleared');

    // Create users
    console.log('Creating users...');
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );
    const createdUsers = await User.insertMany(hashedUsers);
    console.log('Users created successfully');

    // Create products
    console.log('Creating products...');
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log('Products created successfully');

    // Create orders
    console.log('Creating orders...');
    const customer = createdUsers.find(u => u.role === 'customer');
    const shop = createdUsers.find(u => u.role === 'shop');
    const delivery = createdUsers.find(u => u.role === 'delivery');
    
    const sampleOrders = await createSampleOrders(
      customer._id,
      shop._id,
      delivery._id,
      createdProducts
    );
    await Order.insertMany(sampleOrders);
    console.log('Orders created successfully');

    // Print summary
    console.log('\nDatabase Initialization Summary:');
    console.log('--------------------------------');
    console.log(`Users created: ${createdUsers.length}`);
    console.log(`Products created: ${createdProducts.length}`);
    console.log(`Orders created: ${sampleOrders.length}`);

    // Print login credentials
    console.log('\nTest Account Credentials:');
    console.log('------------------------');
    sampleUsers.forEach(user => {
      console.log(`\n${user.role.toUpperCase()}:`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
    });

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the initialization
initializeDatabase(); 