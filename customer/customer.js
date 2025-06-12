const socket = io();
let cart = [];
let token = null;

async function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const name = document.getElementById('name').value;
  const pinCode = document.getElementById('pinCode').value;
  
  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role: 'customer', pinCode })
    });
    const data = await response.json();
    alert(data.message || data.error);
  } catch (error) {
    alert('Registration failed: ' + error.message);
  }
}

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.token) {
      token = data.token;
      localStorage.setItem('userId', data.id);
      document.getElementById('auth').style.display = 'none';
      document.getElementById('products').style.display = 'block';
      document.getElementById('order-form').style.display = 'block';
      loadProducts();
    } else {
      alert(data.error);
    }
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
}

async function loadProducts() {
  try {
    const response = await fetch('/products');
    const products = await response.json();
    const productList = document.getElementById('product-list');
    productList.innerHTML = products.map(p => `
      <div class="product-card">
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>Price: $${p.price}</p>
          <p>Stock: ${p.stock}</p>
        </div>
        <div class="product-actions">
          <button onclick="addToCart('${p._id}', '${p.name}', ${p.price})">Add to Cart</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    alert('Failed to load products: ' + error.message);
  }
}

function addToCart(id, name, price) {
  const existingItem = cart.find(item => item.productId === id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ productId: id, name, price, quantity: 1 });
  }
  alert(`${name} added to cart`);
}

function viewCart() {
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }
  window.location.href = 'cart.html';
}

async function placeOrder() {
  const pin = document.getElementById('orderPin').value;
  if (!pin.match(/^\d{6}$/)) {
    alert('Please enter a valid 6-digit pin code');
    return;
  }
  
  try {
    const response = await fetch('/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ customerPin: pin, products: cart })
    });
    const order = await response.json();
    cart = [];
    window.location.href = 'order-status.html';
  } catch (error) {
    alert('Failed to place order: ' + error.message);
  }
}

socket.on('orderAccepted', (order) => {
  alert(`Order ${order._id} has been accepted!`);
});

socket.on('statusUpdate', (order) => {
  alert(`Order ${order._id} status updated to: ${order.status}`);
}); 