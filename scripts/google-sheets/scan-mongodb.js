const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rajdelver';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  scanDatabase();
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Define schemas for scanning
const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

// Function to convert data to CSV format
function convertToCSV(data, headers) {
  const headerRow = headers.join(',');
  const dataRows = data.map(item => {
    return headers.map(header => {
      const value = item[header];
      // Handle special cases
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
      return value;
    }).join(',');
  });
  return [headerRow, ...dataRows].join('\n');
}

// Function to save data to CSV file
function saveToCSV(data, headers, filename) {
  const outputDir = path.join(__dirname, 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const csvContent = convertToCSV(data, headers);
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, csvContent);
  console.log(`Saved ${filename} with ${data.length} records`);
}

// Function to scan the database
async function scanDatabase() {
  try {
    // Scan Users
    const users = await User.find({});
    const userHeaders = ['_id', 'email', 'name', 'role', 'phone', 'address', 'createdAt', 'updatedAt'];
    saveToCSV(users, userHeaders, 'users.csv');

    // Scan Products
    const products = await Product.find({});
    const productHeaders = ['_id', 'name', 'description', 'price', 'stock', 'category', 'shopId', 'createdAt', 'updatedAt'];
    saveToCSV(products, productHeaders, 'products.csv');

    // Scan Orders
    const orders = await Order.find({})
      .populate('customerId', 'name email')
      .populate('shopId', 'name')
      .populate('deliveryAgentId', 'name')
      .populate('products.productId');
    
    const orderHeaders = [
      '_id',
      'customerId',
      'shopId',
      'deliveryAgentId',
      'products',
      'totalPrice',
      'status',
      'pin',
      'createdAt',
      'updatedAt',
      'trackingLocation'
    ];
    saveToCSV(orders, orderHeaders, 'orders.csv');

    // Create a summary report
    const summary = {
      totalUsers: users.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      ordersByStatus: orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {}),
      scanTime: new Date().toISOString()
    };

    // Save summary report
    const summaryPath = path.join(__dirname, 'data', 'scan-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log('Saved scan summary to scan-summary.json');

    console.log('\nScan Summary:');
    console.log('-------------');
    console.log(`Total Users: ${summary.totalUsers}`);
    console.log(`Total Products: ${summary.totalProducts}`);
    console.log(`Total Orders: ${summary.totalOrders}`);
    console.log('\nOrders by Status:');
    Object.entries(summary.ordersByStatus).forEach(([status, count]) => {
      console.log(`- ${status}: ${count}`);
    });

  } catch (error) {
    console.error('Error scanning database:', error);
  } finally {
    mongoose.connection.close();
  }
} 