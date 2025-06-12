import config from '../shared/config.js';

// Initialize Socket.io with the configured URL
const socket = io(config.socketUrl, {
    transports: ['websocket', 'polling'],
    path: '/socket.io/',
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 60000
});

// Handle socket connection
socket.on('connect', () => {
    console.log('Socket connected successfully');
    document.body.classList.remove('error');
});

socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    document.body.classList.add('error');
    showError('Connection error. Please refresh the page.');
});

socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
        showError('Server disconnected. Please refresh the page.');
    }
});

// Helper function to show errors
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.querySelector('.container').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    try {
        // Disable the submit button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Logging in...';
        
        const response = await fetch(`${config.apiBaseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store the token
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userId', data.id);
            
            // Show success message
            showSuccess('Login successful! Redirecting...');
            
            // Redirect to the products page
            setTimeout(() => {
                window.location.href = 'products.html';
            }, 1000);
        } else {
            showError(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Failed to connect to server. Please try again later.');
    } finally {
        // Re-enable the submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
    }
});

// Helper function to show success messages
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    document.querySelector('.container').prepend(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
} 