// Base URL configuration
const config = {
    // For local development
    baseUrl: window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : 'https://yourusername.github.io/rajdelver',
    
    // API endpoints
    api: {
        login: '/login',
        register: '/register',
        products: '/products',
        orders: '/orders',
        orderStatus: '/orders/:role/:id'
    }
};

// Export the configuration
window.appConfig = config; 