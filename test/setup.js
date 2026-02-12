// Jest setup file - runs before all tests
const mongoose = require('mongoose');

// Ensure we close the MongoDB connection after all tests complete
afterAll(async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
}, 30000);
