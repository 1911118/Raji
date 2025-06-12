require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors({
  origin: ['https://1911118.github.io', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rajdelver', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware for JWT Authentication
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Serve specific HTML files for each role
app.get('/customer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/customer/index.html'));
});

app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/shop/index.html'));
});

app.get('/delivery', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/delivery/index.html'));
});

// Redirect root to customer portal
app.get('/', (req, res) => {
  res.redirect('/customer');
});

// User Routes
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, pinCode } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role, pinCode });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret'
    );
    res.json({ token, role: user.role, id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Product Routes
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/products', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'shop') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/products/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'shop') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/products/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'shop') {
      return res.status(403).json({ error: 'Access denied' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Order Routes
app.post('/orders', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const order = new Order({
      customerId: req.user._id,
      customerPin: req.body.customerPin,
      products: req.body.products,
      status: 'pending',
      createdAt: new Date()
    });
    await order.save();
    io.emit('newOrder', order);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/orders/:role/:id', authenticate, async (req, res) => {
  try {
    const { role, id } = req.params;
    if (req.user.role !== role || req.user._id.toString() !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    let query = {};
    if (role === 'customer') query.customerId = id;
    else if (role === 'shop') query.status = { $in: ['pending', 'accepted', 'on-the-way', 'delivered'] };
    else if (role === 'delivery') query.deliveryId = id;
    const orders = await Order.find(query).populate('products.productId');
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/orders/:id/status', authenticate, async (req, res) => {
  try {
    const { status, deliveryId } = req.body;
    if (req.user.role !== 'shop' && req.user.role !== 'delivery') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const update = { status };
    if (deliveryId) update.deliveryId = deliveryId;
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (status === 'accepted') io.emit('orderAccepted', order);
    else io.emit('statusUpdate', order);
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin: Export Orders to CSV
app.get('/admin/orders/export', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'shop') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const orders = await Order.find().populate('customerId products.productId');
    let csv = 'Order ID,Customer,Pin Code,Products,Status,Created At\n';
    orders.forEach(order => {
      const products = order.products.map(p => `${p.productId.name} (${p.quantity})`).join('; ');
      csv += `${order._id},${order.customerId.name},${order.customerPin},"${products}",${order.status},${order.createdAt}\n`;
    });
    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    res.send(csv);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Socket.IO Events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 