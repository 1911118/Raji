// Base URL configuration
const config = {
    // For local development
    baseUrl: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://1911118.github.io/Raji',
    
    // API endpoints
    api: {
        baseUrl: window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://slimy-papers-wear.loca.lt',
        login: '/login',
        register: '/register',
        products: '/products',
        orders: '/orders',
        orderStatus: '/orders/:role/:id'
    }
};

// Export the configuration
window.appConfig = config; 