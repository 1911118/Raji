require('dotenv').config();
const fetch = require('node-fetch');

async function setupMonitoring() {
  try {
    const apiKey = process.env.UPTIMEROBOT_API_KEY;
    const backendUrl = process.env.BACKEND_URL;

    if (!apiKey || !backendUrl) {
      throw new Error('Missing required environment variables');
    }

    // Create HTTP monitor
    const response = await fetch('https://api.uptimerobot.com/v2/newMonitor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      body: new URLSearchParams({
        api_key: apiKey,
        format: 'json',
        type: 1, // HTTP monitor
        url: backendUrl,
        friendly_name: 'Rajdelver Backend',
        interval: 300, // Check every 5 minutes
        timeout: 30, // 30 seconds timeout
        alert_contacts: process.env.UPTIMEROBOT_ALERT_CONTACT_ID || ''
      })
    });

    const data = await response.json();
    
    if (data.stat === 'ok') {
      console.log('Monitor created successfully:', data.monitor);
    } else {
      console.error('Failed to create monitor:', data.error);
    }
  } catch (error) {
    console.error('Error setting up monitoring:', error);
  }
}

setupMonitoring(); 