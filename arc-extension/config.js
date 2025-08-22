// Extension Configuration
// This file manages environment-specific settings for the browser extension

const CONFIG = {
  development: {
    API_BASE_URL: 'http://localhost:8000',
    API_ENDPOINTS: {
      login: '/api/login/',
      register: '/api/register/',
      portfolio: '/api/portfolio/',
      wallet: '/api/wallet/',
      transfer: '/api/transfer/',
      merchant: '/api/merchant/',
      face_auth: '/api/face-auth/',
      market_data: '/api/market-data/',
      transactions: '/api/transactions/'
    },
    ENVIRONMENT: 'development',
    DEBUG: true,
    TIMEOUT: 10000
  },
  
  production: {
    API_BASE_URL: 'https://arc-backend-production-5f89.up.railway.app',
    API_ENDPOINTS: {
      login: '/api/login/',
      register: '/api/register/',
      portfolio: '/api/portfolio/',
      wallet: '/api/wallet/',
      transfer: '/api/transfer/',
      merchant: '/api/merchant/',
      face_auth: '/api/face-auth/',
      market_data: '/api/market-data/',
      transactions: '/api/transactions/'
    },
    ENVIRONMENT: 'production',
    DEBUG: false,
    TIMEOUT: 15000
  }
};

// Determine current environment (updated by build scripts)
const CURRENT_ENV = 'development'; // Changed by build.bat/build.sh

// Export the current configuration
const EXTENSION_CONFIG = CONFIG[CURRENT_ENV];

// Helper function to get full API URL
function getApiUrl(endpoint) {
  return EXTENSION_CONFIG.API_BASE_URL + EXTENSION_CONFIG.API_ENDPOINTS[endpoint];
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EXTENSION_CONFIG, getApiUrl };
}

// Make config available globally for browser extension
if (typeof window !== 'undefined') {
  window.EXTENSION_CONFIG = EXTENSION_CONFIG;
  window.getApiUrl = getApiUrl;
}
