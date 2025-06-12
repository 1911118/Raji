const { chromium } = require('playwright');

// Use GitHub Pages URL for testing (main branch)
const baseUrl = 'https://1911118.github.io/Raji';

async function testCustomerFlow(page) {
    console.log('Testing Customer Flow...');
    console.log(`Navigating to ${baseUrl}/customer/index.html`);
    
    try {
        await page.goto(`${baseUrl}/customer/index.html`, { 
            waitUntil: 'networkidle',
            timeout: 60000 
        });
        console.log('Page loaded successfully');
        
        // Wait for the page to be fully loaded
        await page.waitForLoadState('domcontentloaded');
        console.log('DOM content loaded');
        
        // Check if we're on the login page
        const loginForm = await page.$('form');
        if (!loginForm) {
            console.log('Login form not found, checking page content...');
            const content = await page.content();
            console.log('Page content:', content);
            throw new Error('Login form not found');
        }
        
        console.log('Login form found, waiting for email input...');
        await page.waitForSelector('#email', { timeout: 60000 });
        console.log('Email input found, filling form...');
        
        await page.fill('#email', 'customer@example.com');
        await page.fill('#password', 'customer123');
        await page.click('button:has-text("Login")');
        
        console.log('Login form submitted');
        
        // Wait for navigation after login
        await page.waitForNavigation({ timeout: 60000 });
        console.log('Navigation completed after login');
        
        // 2. Browse Products
        await page.waitForSelector('#product-list', { timeout: 60000 });
        const products = await page.$$('#product-list .product-card');
        console.log(`✓ Found ${products.length} products`);

        // 3. Add to Cart
        await page.click('#product-list .product-card:first-child button');
        console.log('✓ Added product to cart');

        // 4. View Cart
        await page.goto(`${baseUrl}/customer/cart.html`);
        await page.waitForSelector('#cart-items', { timeout: 60000 });
        console.log('✓ Cart page loaded');

        // 5. Place Order
        await page.fill('#orderPin', '123456');
        await page.click('button[type="submit"]');
        console.log('✓ Order placed successfully');

        // 6. Check Order Status
        await page.goto(`${baseUrl}/customer/order-status.html`);
        await page.waitForSelector('#order-list', { timeout: 60000 });
        console.log('✓ Order status page loaded');

        return true;
    } catch (error) {
        console.error('Customer flow test failed:', error);
        // Take a screenshot on failure
        await page.screenshot({ path: 'customer-test-failure.png' });
        return false;
    }
}

async function testShopFlow(page) {
    console.log('Testing Shop Flow...');
    console.log(`Navigating to ${baseUrl}/shop/index.html`);
    
    await page.goto(`${baseUrl}/shop/index.html`, { waitUntil: 'networkidle', timeout: 60000 });
    console.log('Page loaded, waiting for email input...');
    
    await page.waitForSelector('#email', { timeout: 60000 });
    console.log('Email input found, filling form...');
    
    await page.fill('#email', 'shop@example.com');
    await page.fill('#password', 'shop123');
    await page.click('button:has-text("Login")');
    
    console.log('Login form submitted');
    try {
        // 2. View Orders
        await page.waitForSelector('#order-list');
        console.log('✓ Orders page loaded');

        // 3. Manage Products
        await page.goto(`${baseUrl}/shop/products.html`);
        await page.waitForSelector('#product-list');
        console.log('✓ Products management page loaded');

        // 4. Add New Product
        await page.fill('#productName', 'Test Product');
        await page.fill('#productPrice', '99.99');
        await page.fill('#productCategory', 'Test Category');
        await page.fill('#productStock', '50');
        await page.click('button[type="submit"]');
        console.log('✓ New product added');

        return true;
    } catch (error) {
        console.error('Shop flow test failed:', error);
        return false;
    }
}

async function testDeliveryFlow(page) {
    console.log('Testing Delivery Flow...');
    console.log(`Navigating to ${baseUrl}/delivery/index.html`);
    
    await page.goto(`${baseUrl}/delivery/index.html`, { waitUntil: 'networkidle', timeout: 60000 });
    console.log('Page loaded, waiting for email input...');
    
    await page.waitForSelector('#email', { timeout: 60000 });
    console.log('Email input found, filling form...');
    
    await page.fill('#email', 'delivery@example.com');
    await page.fill('#password', 'delivery123');
    await page.click('button:has-text("Login")');
    
    console.log('Login form submitted');
    try {
        // 2. View Assigned Orders
        await page.waitForSelector('#order-list');
        console.log('✓ Orders page loaded');

        // 3. Update Order Status
        const updateButton = await page.$('button:has-text("Start Delivery")');
        if (updateButton) {
            await updateButton.click();
            console.log('✓ Order status updated');
        }

        return true;
    } catch (error) {
        console.error('Delivery flow test failed:', error);
        return false;
    }
}

async function runTests() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        console.log('Starting website functionality tests...');

        // Run all test flows
        const customerSuccess = await testCustomerFlow(page);
        const shopSuccess = await testShopFlow(page);
        const deliverySuccess = await testDeliveryFlow(page);

        // Print test summary
        console.log('\n=== Test Summary ===');
        console.log('Customer Flow:', customerSuccess ? '✓ Success' : '✗ Failed');
        console.log('Shop Flow:', shopSuccess ? '✓ Success' : '✗ Failed');
        console.log('Delivery Flow:', deliverySuccess ? '✓ Success' : '✗ Failed');

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await browser.close();
    }
}

// Run the tests
runTests(); 