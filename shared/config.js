// Base URL configuration
const config = {
    baseUrl: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://1911118.github.io/Raji',
    apiBaseUrl: window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://chatty-books-sing.loca.lt',
    socketUrl: window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://chatty-books-sing.loca.lt'
};

// Log configuration for debugging
console.log('Current configuration:', {
    hostname: window.location.hostname,
    apiBaseUrl: config.apiBaseUrl,
    socketUrl: config.socketUrl
});

export default config; 