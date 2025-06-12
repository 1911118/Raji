require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB Connection
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rajdelver';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Connection URI:', MONGODB_URI);

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Successfully connected to MongoDB');

    // Test database access
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Test each collection
    console.log('\nTesting collection access:');
    
    // Users collection
    const User = mongoose.model('User', new mongoose.Schema({}));
    const userCount = await User.countDocuments();
    console.log(`✓ Users collection: ${userCount} documents`);

    // Products collection
    const Product = mongoose.model('Product', new mongoose.Schema({}));
    const productCount = await Product.countDocuments();
    console.log(`✓ Products collection: ${productCount} documents`);

    // Orders collection
    const Order = mongoose.model('Order', new mongoose.Schema({}));
    const orderCount = await Order.countDocuments();
    console.log(`✓ Orders collection: ${orderCount} documents`);

    // Database stats
    const stats = await mongoose.connection.db.stats();
    console.log('\nDatabase Statistics:');
    console.log(`- Database name: ${stats.db}`);
    console.log(`- Collections: ${stats.collections}`);
    console.log(`- Documents: ${stats.objects}`);
    console.log(`- Data size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Storage size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);

  } catch (error) {
    console.error('Error testing connection:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection test completed');
  }
}

// Run the test
testConnection(); 