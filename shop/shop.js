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
      body: JSON.stringify({ name, email, password, role: 'shop', pinCode })
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
      document.getElementById('dashboard').style.display = 'block';
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
    const response = await fetch(`/orders/shop/${localStorage.getItem('userId')}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const orders = await response.json();
    const orderList = document.getElementById('order-list');
    
    if (orders.length === 0) {
      orderList.innerHTML = '<p>No pending orders</p>';
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
          <button onclick="acceptOrder('${o._id}')">Accept</button>
          <button onclick="rejectOrder('${o._id}')">Reject</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    alert('Failed to load orders: ' + error.message);
  }
}

async function acceptOrder(orderId) {
  const deliveryId = prompt('Enter Delivery Agent ID:');
  if (!deliveryId) return;
  
  try {
    const response = await fetch(`/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'accepted', deliveryId })
    });
    const order = await response.json();
    alert(`Order ${order._id} accepted`);
    loadOrders();
  } catch (error) {
    alert('Failed to accept order: ' + error.message);
  }
}

async function rejectOrder(orderId) {
  try {
    const response = await fetch(`/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'rejected' })
    });
    const order = await response.json();
    alert(`Order ${order._id} rejected`);
    loadOrders();
  } catch (error) {
    alert('Failed to reject order: ' + error.message);
  }
}

async function exportOrders() {
  try {
    const response = await fetch('/admin/orders/export', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    alert('Failed to export orders: ' + error.message);
  }
}

socket.on('newOrder', (order) => {
  new Audio('notification.mp3').play();
  alert(`New order received: ${order._id}`);
  loadOrders();
});

socket.on('statusUpdate', (order) => {
  alert(`Order ${order._id} status updated to: ${order.status}`);
  loadOrders();
}); 