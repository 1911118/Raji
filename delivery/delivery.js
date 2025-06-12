const socket = io();
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
      body: JSON.stringify({ name, email, password, role: 'delivery', pinCode })
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
      document.getElementById('orders').style.display = 'block';
      loadOrders();
    } else {
      alert(data.error);
    }
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
}

async function loadOrders() {
  try {
    const response = await fetch(`/orders/delivery/${localStorage.getItem('userId')}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const orders = await response.json();
    const orderList = document.getElementById('order-list');
    
    if (orders.length === 0) {
      orderList.innerHTML = '<p>No assigned orders</p>';
      return;
    }
    
    orderList.innerHTML = orders.map(o => `
      <div class="product-card">
        <div class="product-info">
          <h3>Order ID: ${o._id}</h3>
          <p>Status: <span class="status-badge status-${o.status}">${o.status}</span></p>
          <p>Pin Code: ${o.customerPin}</p>
          <p>Created: ${new Date(o.createdAt).toLocaleString()}</p>
          <h4>Products:</h4>
          <ul>
            ${o.products.map(p => `
              <li>${p.productId.name} - Quantity: ${p.quantity}</li>
            `).join('')}
          </ul>
        </div>
        <div class="product-actions">
          ${o.status === 'accepted' ? `
            <button onclick="updateStatus('${o._id}', 'on-the-way')">Start Delivery</button>
          ` : ''}
          ${o.status === 'on-the-way' ? `
            <button onclick="updateStatus('${o._id}', 'delivered')">Mark as Delivered</button>
          ` : ''}
        </div>
      </div>
    `).join('');
  } catch (error) {
    alert('Failed to load orders: ' + error.message);
  }
}

async function updateStatus(orderId, status) {
  try {
    const response = await fetch(`/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    const order = await response.json();
    alert(`Order ${order._id} status updated to ${status}`);
    loadOrders();
  } catch (error) {
    alert('Failed to update status: ' + error.message);
  }
}

socket.on('orderAccepted', (order) => {
  if (order.deliveryId === localStorage.getItem('userId')) {
    alert(`New order assigned: ${order._id}`);
    loadOrders();
  }
});

socket.on('statusUpdate', (order) => {
  if (order.deliveryId === localStorage.getItem('userId')) {
    alert(`Order ${order._id} status updated to: ${order.status}`);
    loadOrders();
  }
}); 