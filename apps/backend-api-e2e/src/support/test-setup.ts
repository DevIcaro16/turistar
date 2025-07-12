/* eslint-disable */
import axios from 'axios';

// Global test configuration
export const TEST_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3 // 3 tentativas
};

// Configure axios defaults for tests
axios.defaults.timeout = TEST_CONFIG.TIMEOUT;
axios.defaults.baseURL = TEST_CONFIG.BASE_URL;

// Test utilities
export const testUtils = {
  // Wait for server to be ready
  async waitForServer() {
    let attempts = 0;
    while (attempts < TEST_CONFIG.RETRY_ATTEMPTS) {
      try {
        await axios.get('/');
        return true;
      } catch (error) {
        attempts++;
        if (attempts >= TEST_CONFIG.RETRY_ATTEMPTS) {
          throw new Error('Server not ready after multiple attempts');
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  },

  // Generate unique test data
  generateTestUser() {
    const timestamp = Date.now();
    return {
      name: `Test User ${timestamp}`,
      email: `test${timestamp}@example.com`,
      phone: '(11) 99999-9999',
      password: 'testpassword123'
    };
  },

  generateTestDriver() {
    const timestamp = Date.now();
    return {
      name: `Test Driver ${timestamp}`,
      email: `driver${timestamp}@example.com`,
      phone: '(11) 99999-9999',
      password: 'testpassword123',
      licenseNumber: `LIC${timestamp}`,
      transportType: 'BUGGY'
    };
  },

  // Clean up test data (if needed)
  async cleanupTestData() {
    // This would be implemented based on your cleanup needs
    // For now, it's a placeholder
  }
};

// Global setup and teardown
beforeAll(async () => {
  await testUtils.waitForServer();
});

afterAll(async () => {
  await testUtils.cleanupTestData();
});
