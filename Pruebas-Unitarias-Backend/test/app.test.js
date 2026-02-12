const request = require('supertest');
const app = require('../src/app');
const Doctor = require('../src/models/Doctor');
const Paciente = require('../src/models/Paciente');
const Especialidad = require('../src/models/Especialidad');
const Medicamento = require('../src/models/Medicamento');
const mongoose = require('mongoose');

describe('Backend App API - Main Endpoints', () => {
    // Clear database before test suite
    beforeAll(async () => {
        await Doctor.deleteMany({});
        await Paciente.deleteMany({});
        await Especialidad.deleteMany({});
        await Medicamento.deleteMany({});
    });

    // Clear database before each test
    beforeEach(async () => {
        await Doctor.deleteMany({});
        await Paciente.deleteMany({});
        await Especialidad.deleteMany({});
        await Medicamento.deleteMany({});
    });

    // Test CORS OPTIONS method
    test('OPTIONS request - should allow CORS with method OPTIONS', async () => {
        const res = await request(app)
            .options('/api/doctores')
            .set('Origin', 'http://example.com');

        expect(res.statusCode).toBe(200);
    });

    // Test CORS headers on regular requests
    test('GET request - should include CORS headers', async () => {
        const res = await request(app)
            .get('/api/doctores')
            .set('Origin', 'http://example.com');

        expect(res.statusCode).toBe(200);
        expect(res.header['access-control-allow-origin']).toBe('*');
    });

    // Test 404 handler
    test('GET /nonexistent - should return 404', async () => {
        const res = await request(app).get('/nonexistent');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Route not found');
    });

    // Test health endpoint
    test('GET /api/health - should return server status', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status', 'OK');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body).toHaveProperty('mongodb');
    });

    // Test test-logs endpoint
    test('GET /api/test-logs - should return test logs', async () => {
        const res = await request(app).get('/api/test-logs');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('logs');
        expect(Array.isArray(res.body.logs)).toBe(true);
    });


});
