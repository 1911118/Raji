// Base URL configuration
const config = {
    // For local development
    baseUrl: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://1911118.github.io/Raji',
    apiBaseUrl: window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://fruity-eels-join.loca.lt',
    socketUrl: window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://fruity-eels-join.loca.lt',
    
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
export default config; 