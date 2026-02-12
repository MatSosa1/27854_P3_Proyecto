const request = require('supertest');
const app = require('../src/app');
const Doctor = require('../src/models/Doctor');
const mongoose = require('mongoose');

describe('Doctors API', () => {
    // Clear database before test suite
    beforeAll(async () => {
        await Doctor.deleteMany({});
    });

    // Clear database before each test
    beforeEach(async () => {
        await Doctor.deleteMany({});
    });



    // Test GET - list doctors (initially empty)
    test('GET /api/doctores - should return empty array initially', async () => {
        const response = await request(app).get('/api/doctores');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    // Test POST - create doctor
    test('POST /api/doctores - should create a new doctor', async () => {
        const newDoctor = {
            name: 'Carlos',
            lastName: 'Ramírez',
            specialty: 'Cardiología',
            phone: '0987654321',
            email: 'carlos.ramirez@hospital.com',
            licenseNumber: 'LIC-12345',
        };

        const response = await request(app)
            .post('/api/doctores')
            .send(newDoctor);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe('Carlos');
        expect(response.body.lastName).toBe('Ramírez');
        expect(response.body.specialty).toBe('Cardiología');
        expect(response.body.licenseNumber).toBe('LIC-12345');
    });

    // Test POST - required fields validation
    test('POST /api/doctores - should return 400 error if fields are missing', async () => {
        const incompleteDoctor = {
            name: 'Maria',
            lastName: 'Gonzalez',
            // Missing: specialty, phone, email, licenseNumber
        };

        const response = await request(app)
            .post('/api/doctores')
            .send(incompleteDoctor);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    // Test POST - Duplicate license number validation
    test('POST /api/doctores - should return 409 error if license number already exists', async () => {
        // First, create a doctor
        await request(app).post('/api/doctores').send({
            name: 'Carlos',
            lastName: 'Ramírez',
            specialty: 'Cardiología',
            phone: '0987654321',
            email: 'carlos.ramirez@hospital.com',
            licenseNumber: 'LIC-12345',
        });

        const duplicateDoctor = {
            name: 'Pedro',
            lastName: 'Sánchez',
            specialty: 'Pediatría',
            phone: '0998765432',
            email: 'pedro.sanchez@hospital.com',
            licenseNumber: 'LIC-12345', // Same license number
        };

        const response = await request(app)
            .post('/api/doctores')
            .send(duplicateDoctor);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('A doctor with this license number already exists');
    });

    test('should return 409 if license number already exists in another doctor', async () => {
        const doctor1 = await request(app).post('/api/doctores').send({
            name: 'John',
            lastName: 'Doe',
            specialty: 'Cardiology',
            phone: '1234567890',
            email: 'john@example.com',
            licenseNumber: 'LIC-001',
        });

        const doctor2 = await request(app).post('/api/doctores').send({
            name: 'Jane',
            lastName: 'Smith',
            specialty: 'Neurology',
            phone: '0987654321',
            email: 'jane@example.com',
            licenseNumber: 'LIC-002',
        });

        const res = await request(app)
            .put(`/api/doctores/${doctor2.body._id}`)
            .send({ licenseNumber: 'LIC-001' });

        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('message', 'A doctor with this license number already exists');
    });

    test('should allow updating doctor with same license number', async () => {
        const doctor = await request(app).post('/api/doctores').send({
            name: 'John',
            lastName: 'Doe',
            specialty: 'Cardiology',
            phone: '1234567890',
            email: 'john@example.com',
            licenseNumber: 'LIC-00001',
        });

        const res = await request(app)
            .put(`/api/doctores/${doctor.body._id}`)
            .send({
                name: 'John Updated',
                licenseNumber: 'LIC-00001',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('licenseNumber', 'LIC-00001');
        expect(res.body).toHaveProperty('name', 'John Updated');
    });

    // Test GET - List doctors (after creating one)
    test('GET /api/doctores - should return array with doctors', async () => {
        // Create a doctor first
        await request(app).post('/api/doctores').send({
            name: 'Test',
            lastName: 'Doctor',
            specialty: 'General',
            phone: '1234567890',
            email: 'test@example.com',
            licenseNumber: 'LIC-TEST',
        });

        const response = await request(app).get('/api/doctores');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    // Test PUT - Update doctor
    test('PUT /api/doctores/:id - should update an existing doctor', async () => {
        // Create a doctor first
        const doctor = await request(app).post('/api/doctores').send({
            name: 'Carlos',
            lastName: 'Ramírez',
            specialty: 'Cardiología',
            phone: '0987654321',
            email: 'carlos.ramirez@hospital.com',
            licenseNumber: 'LIC-UPDATE-TEST',
        });

        const updatedData = {
            specialty: 'Neurocirugía',
            phone: '0912345678',
        };

        const response = await request(app)
            .put(`/api/doctores/${doctor.body._id}`)
            .send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body.specialty).toBe('Neurocirugía');
        expect(response.body.phone).toBe('0912345678');
        expect(response.body.name).toBe('Carlos'); // Should not change
    });

    // Test PUT - Doctor not found
    test('PUT /api/doctores/:id - should return 404 if doctor does not exist', async () => {
        // Create a doctor first
        const doctor = await request(app).post('/api/doctores').send({
            name: 'ToDelete',
            lastName: 'Doctor',
            specialty: 'Test',
            phone: '1111111111',
            email: 'delete@example.com',
            licenseNumber: 'LIC-DELETE-TEST',
        });

        const response = await request(app).delete(`/api/doctores/${doctor.body._id}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body._id).toBe(doctor.body._id);
    });

    // Test DELETE - Doctor not found
    test('DELETE /api/doctores/:id - should return 404 if doctor does not exist', async () => {
        const response = await request(app).delete('/api/doctores/507f1f77bcf86cd799439011');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Doctor not found');
    });

    // Test POST - Individual field validation
    test('POST /api/doctores - should reject doctor without name', async () => {
        const response = await request(app).post('/api/doctores').send({
            lastName: 'Test',
            specialty: 'Cardiología',
            phone: '0987654321',
            email: 'test@hospital.com',
            licenseNumber: 'LIC-VALID-001',
        });
        expect(response.status).toBe(400);
    });

    test('POST /api/doctores - should reject doctor without lastName', async () => {
        const response = await request(app).post('/api/doctores').send({
            name: 'Test',
            specialty: 'Cardiología',
            phone: '0987654321',
            email: 'test@hospital.com',
            licenseNumber: 'LIC-VALID-002',
        });
        expect(response.status).toBe(400);
    });

    test('POST /api/doctores - should reject doctor without specialty', async () => {
        const response = await request(app).post('/api/doctores').send({
            name: 'Test',
            lastName: 'Test',
            phone: '0987654321',
            email: 'test@hospital.com',
            licenseNumber: 'LIC-VALID-003',
        });
        expect(response.status).toBe(400);
    });

    test('POST /api/doctores - should reject doctor without phone', async () => {
        const response = await request(app).post('/api/doctores').send({
            name: 'Test',
            lastName: 'Test',
            specialty: 'Cardiología',
            email: 'test@hospital.com',
            licenseNumber: 'LIC-VALID-004',
        });
        expect(response.status).toBe(400);
    });

    test('POST /api/doctores - should reject doctor without email', async () => {
        const response = await request(app).post('/api/doctores').send({
            name: 'Test',
            lastName: 'Test',
            specialty: 'Cardiología',
            phone: '0987654321',
            licenseNumber: 'LIC-VALID-005',
        });
        expect(response.status).toBe(400);
    });

    test('POST /api/doctores - should reject doctor without licenseNumber', async () => {
        const response = await request(app).post('/api/doctores').send({
            name: 'Test',
            lastName: 'Test',
            specialty: 'Cardiología',
            phone: '0987654321',
            email: 'test@hospital.com',
        });
        expect(response.status).toBe(400);
    });

    // Test PUT - Update with individual fields
    test('PUT /api/doctores/:id - should update only name', async () => {
        const doctor = await request(app).post('/api/doctores').send({
            name: 'Original',
            lastName: 'Name',
            specialty: 'Cardiología',
            phone: '0987654321',
            email: 'test@hospital.com',
            licenseNumber: 'LIC-UPDATE-001',
        });

        const response = await request(app)
            .put(`/api/doctores/${doctor.body._id}`)
            .send({ name: 'Updated' });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated');
        expect(response.body.lastName).toBe('Name'); // Should remain unchanged
    });

    test('PUT /api/doctores/:id - should update only lastName', async () => {
        const doctor = await request(app).post('/api/doctores').send({
            name: 'John',
            lastName: 'Original',
            specialty: 'Pediatría',
            phone: '0987654322',
            email: 'test2@hospital.com',
            licenseNumber: 'LIC-UPDATE-002',
        });

        const response = await request(app)
            .put(`/api/doctores/${doctor.body._id}`)
            .send({ lastName: 'Updated' });

        expect(response.status).toBe(200);
        expect(response.body.lastName).toBe('Updated');
        expect(response.body.name).toBe('John'); // Should remain unchanged
    });

    test('PUT /api/doctores/:id - should update email and specialty', async () => {
        const doctor = await request(app).post('/api/doctores').send({
            name: 'Jane',
            lastName: 'Doe',
            specialty: 'Oftalmología',
            phone: '0987654323',
            email: 'jane@hospital.com',
            licenseNumber: 'LIC-UPDATE-003',
        });

        const response = await request(app)
            .put(`/api/doctores/${doctor.body._id}`)
            .send({ 
                email: 'jane.updated@hospital.com',
                specialty: 'Dermatología'
            });

        expect(response.status).toBe(200);
        expect(response.body.email).toBe('jane.updated@hospital.com');
        expect(response.body.specialty).toBe('Dermatología');
    });

    test('PUT /api/doctores/:id - should update non-existent doctor and return 404', async () => {
        const fakeId = '607f1f77bcf86cd799439011';
        const response = await request(app)
            .put(`/api/doctores/${fakeId}`)
            .send({ name: 'Updated' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Doctor not found');
    });

    test('PUT /api/doctores/:id - should return complete updated doctor object', async () => {
        const doctor = await request(app).post('/api/doctores').send({
            name: 'Complete',
            lastName: 'Doctor',
            specialty: 'Medicina',
            phone: '0987654324',
            email: 'complete@hospital.com',
            licenseNumber: 'LIC-UPDATE-004',
        });

        const response = await request(app)
            .put(`/api/doctores/${doctor.body._id}`)
            .send({ specialty: 'Cirugía' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('lastName');
        expect(response.body).toHaveProperty('specialty');
        expect(response.body).toHaveProperty('phone');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('licenseNumber');
    });

    test('GET /api/doctores - should return doctors with all fields', async () => {
        const doctor = await request(app).post('/api/doctores').send({
            name: 'Full',
            lastName: 'Details',
            specialty: 'Neurología',
            phone: '0987654325',
            email: 'full@hospital.com',
            licenseNumber: 'LIC-FULL-001',
        });

        const response = await request(app).get('/api/doctores');
        
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        const foundDoctor = response.body.find(d => d._id === doctor.body._id);
        expect(foundDoctor).toBeDefined();
        expect(foundDoctor).toHaveProperty('name', 'Full');
        expect(foundDoctor).toHaveProperty('lastName', 'Details');
    });
});
