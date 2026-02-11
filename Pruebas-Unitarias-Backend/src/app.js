const express = require('express');
const path = require('node:path');
const mongoose = require('mongoose');
require('dotenv').config();

const patientRoutes = require('./routes/pacientes.routes');
const medicamentosRoutes = require('./routes/medicamentos.routes');
const especialidadesRoutes = require('./routes/especialidades.routes');
const doctoresRoutes = require('./routes/doctores.routes');
const { runTests, getTestLogs } = require('./testRunner');

const app = express(); // Creates an Express application instance

// CORS Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Middleware to parse JSON from request body
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('✅ MongoDB conectado'))
        .catch(err => console.log('⚠️  MongoDB no disponible:', err.message));
}

// API Routes
app.use('/api/pacientes', patientRoutes);
app.use('/api/medicamentos', medicamentosRoutes);
app.use('/api/especialidades', especialidadesRoutes);
app.use('/api/doctores', doctoresRoutes);

// Endpoint to run tests with custom failure configuration
app.post('/api/run-tests', (req, res) => {
    const { failTests } = req.body;

    runTests(failTests, (error, result) => {
        if (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
        res.json(result);
    });
});

// Endpoint to get test logs
app.get('/api/test-logs', (req, res) => {
    try {
        const logs = getTestLogs();
        res.json({ success: true, logs: logs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check endpoint (useful for monitoring)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Handler for routes not found (404)
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Export app to use it in tests or in a separate server file
module.exports = app;
