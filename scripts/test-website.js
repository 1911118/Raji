require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Test credentials
const testUsers = {
  customer: {
    email: 'customer@example.com',
    password: 'customer123',
    role: 'customer'
  },
  shop: {
    email: 'shop@example.com',
    password: 'shop123',
    role: 'shop'
  },
  delivery: {
    email: 'delivery@example.com',
    password: 'delivery123',
    role: 'delivery'
  }
};

async function testCustomerFlow() {
  console.log('\n=== Testing Customer Flow ===');
  try {
    // 1. Browse Products
    const products = await Product.find();
    console.log('✓ Customer can view products');
    console.log(`Found ${products.length} products`);

    // 2. Create Order
    const customer = await User.findOne({ email: testUsers.customer.email });
    const newOrder = new Order({
      customerId: customer._id,
      customerPin: customer.pinCode,
      products: [
        { productId: products[0]._id, quantity: 2 },
        { productId: products[1]._id, quantity: 1 }
      ],
      status: 'pending'
    });
    await newOrder.save();
    console.log('✓ Customer can create order');

    // 3. View Order History
    const orders = await Order.find({ customerId: customer._id });
    console.log('✓ Customer can view order history');
    console.log(`Found ${orders.length} orders`);

    return newOrder._id;
  } catch (error) {
    console.error('Customer flow test failed:', error);
    return null;
  }
}

async function testShopFlow() {
  console.log('\n=== Testing Shop Owner Flow ===');
  try {
    // 1. View Orders
    const orders = await Order.find({ status: 'pending' });
    console.log('✓ Shop owner can view pending orders');
    console.log(`Found ${orders.length} pending orders`);

    // 2. Update Order Status
    if (orders.length > 0) {
      const order = orders[0];
      order.status = 'accepted';
      await order.save();
      console.log('✓ Shop owner can update order status to accepted');

      // 3. Assign Delivery Agent
      const deliveryAgent = await User.findOne({ role: 'delivery' });
      order.deliveryId = deliveryAgent._id;
      order.status = 'assigned';
      await order.save();
      console.log('✓ Shop owner can assign delivery agent and set status to assigned');
    }

    // 4. Manage Products
    const newProduct = new Product({
      name: 'Test Product',
      price: 99.99,
      category: 'Test Category',
      stock: 50
    });
    await newProduct.save();
    console.log('✓ Shop owner can add new product');

    return orders[0]?._id;
  } catch (error) {
    console.error('Shop flow test failed:', error);
    return null;
  }
}

async function testDeliveryFlow() {
  console.log('\n=== Testing Delivery Agent Flow ===');
  try {
    // 1. View Assigned Orders
    const deliveryAgent = await User.findOne({ email: testUsers.delivery.email });
    const orders = await Order.find({ 
      deliveryId: deliveryAgent._id,
      status: 'assigned'
    });
    console.log('✓ Delivery agent can view assigned orders');
    console.log(`Found ${orders.length} assigned orders`);

    // 2. Update Order Status
    if (orders.length > 0) {
      const order = orders[0];
      order.status = 'on-the-way';
      await order.save();
      console.log('✓ Delivery agent can update order status to on-the-way');

      // 3. Mark Order as Delivered
      order.status = 'delivered';
      await order.save();
      console.log('✓ Delivery agent can mark order as delivered');
    }

    return orders[0]?._id;
  } catch (error) {
    console.error('Delivery flow test failed:', error);
    return null;
  }
}

async function runFullTest() {
  try {
    console.log('Starting full website test...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rajdelver', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Run all test flows
    const customerOrderId = await testCustomerFlow();
    const shopOrderId = await testShopFlow();
    const deliveryOrderId = await testDeliveryFlow();

    // Print test summary
    console.log('\n=== Test Summary ===');
    console.log('Customer Flow:', customerOrderId ? '✓ Success' : '✗ Failed');
    console.log('Shop Flow:', shopOrderId ? '✓ Success' : '✗ Failed');
    console.log('Delivery Flow:', deliveryOrderId ? '✓ Success' : '✗ Failed');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nTest completed');
  }
}

// Run the full test
runFullTest(); 