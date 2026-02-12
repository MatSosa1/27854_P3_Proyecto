const request = require('supertest');
const app = require('../src/app');
const Doctor = require('../src/models/Doctor');
const mongoose = require('mongoose');

describe('Doctores API - Pruebas Unitarias con Patrón AAA', () => {
    // Limpieza de base de datos antes de la suite de pruebas
    beforeAll(async () => {
        await Doctor.deleteMany({});
    });

    // Limpieza de base de datos antes de cada prueba
    beforeEach(async () => {
        await Doctor.deleteMany({});
    });

    describe('GET /api/doctores', () => {
        test('Debe retornar un array vacío inicialmente', async () => {
            // ARRANGE: Base de datos vacía
            
            // ACT: Realizar petición GET
            const response = await request(app).get('/api/doctores');
            
            // ASSERT: Verificar respuesta vacía
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        test('Debe retornar todos los doctores registrados', async () => {
            // ARRANGE: Crear doctores de prueba
            await Doctor.create([
                {
                    name: 'Carlos',
                    lastName: 'Ramírez',
                    specialty: 'Cardiología',
                    phone: '0987654321',
                    email: 'carlos@hospital.com',
                    licenseNumber: 'LIC-001',
                },
                {
                    name: 'María',
                    lastName: 'González',
                    specialty: 'Pediatría',
                    phone: '0987654322',
                    email: 'maria@hospital.com',
                    licenseNumber: 'LIC-002',
                },
            ]);
            
            // ACT: Obtener lista de doctores
            const response = await request(app).get('/api/doctores');
            
            // ASSERT: Verificar que retorna 2 doctores (sin importar orden)
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            const names = response.body.map(d => d.name);
            expect(names).toContain('Carlos');
            expect(names).toContain('María');
        });

        test('Debe retornar estructura completa de doctor', async () => {
            const doctor = {
                name: 'Test',
                lastName: 'Doctor',
                specialty: 'Medicina',
                phone: '0987654321',
                email: 'test@hospital.com',
                licenseNumber: 'LIC-TEST',
            };
            await request(app).post('/api/doctores').send(doctor);
            
            const response = await request(app).get('/api/doctores');
            
            expect(response.status).toBe(200);
            expect(response.body[0]).toHaveProperty('_id');
            expect(response.body[0]).toHaveProperty('name');
            expect(response.body[0]).toHaveProperty('lastName');
            expect(response.body[0]).toHaveProperty('specialty');
        });
    });

    describe('POST /api/doctores', () => {
        test('Debe crear un nuevo doctor con datos válidos', async () => {
            // ARRANGE: Preparar datos del nuevo doctor
            const newDoctor = {
                name: 'Carlos',
                lastName: 'Ramírez',
                specialty: 'Cardiología',
                phone: '0987654321',
                email: 'carlos.ramirez@hospital.com',
                licenseNumber: 'LIC-12345',
            };

            // ACT: Enviar petición POST
            const response = await request(app)
                .post('/api/doctores')
                .send(newDoctor);

            // ASSERT: Verificar creación exitosa
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            expect(response.body.name).toBe('Carlos');
            expect(response.body.lastName).toBe('Ramírez');
            expect(response.body.specialty).toBe('Cardiología');
            expect(response.body.licenseNumber).toBe('LIC-12345');
        });

        test('Debe rechazar doctor con campos faltantes', async () => {
            // ARRANGE: Datos incompletos (faltan campos requeridos)
            const incompleteDoctor = {
                name: 'Maria',
                lastName: 'Gonzalez',
                // Faltan: specialty, phone, email, licenseNumber
            };

            // ACT: Intentar crear doctor con datos incompletos
            const response = await request(app)
                .post('/api/doctores')
                .send(incompleteDoctor);

            // ASSERT: Verificar error 400
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
        });

        test('Debe rechazar doctor con número de licencia duplicado', async () => {
            // ARRANGE: Crear primer doctor
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
                licenseNumber: 'LIC-12345', // Número de licencia duplicado
            };

            // ACT: Intentar crear doctor con licencia duplicada
            const response = await request(app)
                .post('/api/doctores')
                .send(duplicateDoctor);

            // ASSERT: Verificar error 409 (conflicto)
            expect(response.status).toBe(409);
        });

        test('Debe rechazar doctor sin nombre', async () => {
            const response = await request(app).post('/api/doctores').send({
                lastName: 'Test',
                specialty: 'Cardiología',
                phone: '0987654321',
                email: 'test@hospital.com',
                licenseNumber: 'LIC-TEST-001',
            });
            expect(response.status).toBe(400);
        });

        test('Debe rechazar doctor sin specialty', async () => {
            const response = await request(app).post('/api/doctores').send({
                name: 'Test',
                lastName: 'Test',
                phone: '0987654321',
                email: 'test@hospital.com',
                licenseNumber: 'LIC-TEST-002',
            });
            expect(response.status).toBe(400);
        });

        test('Debe rechazar doctor sin licenseNumber', async () => {
            const response = await request(app).post('/api/doctores').send({
                name: 'Test',
                lastName: 'Test',
                specialty: 'Cardiología',
                phone: '0987654321',
                email: 'test@hospital.com',
            });
            expect(response.status).toBe(400);
        });
        test('Debe rechazar doctor sin phone', async () => {
            const response = await request(app).post('/api/doctores').send({
                name: 'Test',
                lastName: 'Test',
                specialty: 'Cardiología',
                email: 'test@hospital.com',
                licenseNumber: 'LIC-TEST-003',
            });
            expect(response.status).toBe(400);
        });

        test('Debe rechazar doctor sin email', async () => {
            const response = await request(app).post('/api/doctores').send({
                name: 'Test',
                lastName: 'Test',
                specialty: 'Cardiología',
                phone: '0987654321',
                licenseNumber: 'LIC-TEST-004',
            });
            expect(response.status).toBe(400);
        });

        test('Debe rechazar doctor sin lastName', async () => {
            const response = await request(app).post('/api/doctores').send({
                name: 'Test',
                specialty: 'Cardiología',
                phone: '0987654321',
                email: 'test@hospital.com',
                licenseNumber: 'LIC-TEST-005',
            });
            expect(response.status).toBe(400);
        });    });

    describe('PUT /api/doctores/:id', () => {
        test('Debe actualizar un doctor existente', async () => {
            const doctor = {
                name: 'Ana',
                lastName: 'Martínez',
                specialty: 'Neurología',
                phone: '0981234567',
                email: 'ana@hospital.com',
                licenseNumber: 'LIC-999',
            };
            const created = await request(app).post('/api/doctores').send(doctor);
            const id = created.body._id;

            const response = await request(app)
                .put(`/api/doctores/${id}`)
                .send({ 
                    name: 'Ana Updated',
                    specialty: 'Cardiología',
                    phone: '0999999999',
                });

            expect(response.status).toBe(200);
            expect(response.body.name).toBe('Ana Updated');
            expect(response.body.specialty).toBe('Cardiología');
            expect(response.body.phone).toBe('0999999999');
        });

        test('Debe actualizar solo algunos campos', async () => {
            const doctor = {
                name: 'Rosa',
                lastName: 'González',
                specialty: 'Pediatría',
                phone: '0982222222',
                email: 'rosa@hospital.com',
                licenseNumber: 'LIC-666',
            };
            const created = await request(app).post('/api/doctores').send(doctor);
            const id = created.body._id;

            const response = await request(app)
                .put(`/api/doctores/${id}`)
                .send({ phone: '0999888888' });

            expect(response.status).toBe(200);
            expect(response.body.phone).toBe('0999888888');
            expect(response.body.name).toBe('Rosa');
            expect(response.body.specialty).toBe('Pediatría');
        });

        test('Debe rechazar actualización de licenseNumber duplicado', async () => {
            const doctor1 = await request(app).post('/api/doctores').send({
                name: 'Doctor1',
                lastName: 'Test',
                specialty: 'Cardiología',
                phone: '0981111111',
                email: 'doc1@hospital.com',
                licenseNumber: 'LIC-111',
            });

            const doctor2 = await request(app).post('/api/doctores').send({
                name: 'Doctor2',
                lastName: 'Test',
                specialty: 'Pediatría',
                phone: '0982222222',
                email: 'doc2@hospital.com',
                licenseNumber: 'LIC-222',
            });

            const response = await request(app)
                .put(`/api/doctores/${doctor2.body._id}`)
                .send({ licenseNumber: 'LIC-111' });

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('message', 'A doctor with this license number already exists');
        });

        test('Debe retornar 404 al actualizar doctor inexistente', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .put(`/api/doctores/${fakeId}`)
                .send({ specialty: 'Dermatología' });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Doctor not found');
        });

        test('Debe permitir actualizar licenseNumber con el mismo valor', async () => {
            const doctor = {
                name: 'Juan',
                lastName: 'Pérez',
                specialty: 'Oftalmología',
                phone: '0983333333',
                email: 'juan@hospital.com',
                licenseNumber: 'LIC-333',
            };
            const created = await request(app).post('/api/doctores').send(doctor);
            const id = created.body._id;

            const response = await request(app)
                .put(`/api/doctores/${id}`)
                .send({ name: 'Juan Updated', licenseNumber: 'LIC-333' });

            expect(response.status).toBe(200);
            expect(response.body.name).toBe('Juan Updated');
            expect(response.body.licenseNumber).toBe('LIC-333');
        });
    });

    describe('DELETE /api/doctores/:id', () => {
        test('Debe eliminar un doctor existente', async () => {
            const doctor = {
                name: 'Luis',
                lastName: 'Fernández',
                specialty: 'Oftalmología',
                phone: '0987777777',
                email: 'luis@hospital.com',
                licenseNumber: 'LIC-777',
            };
            const created = await request(app).post('/api/doctores').send(doctor);
            const id = created.body._id;

            const response = await request(app).delete(`/api/doctores/${id}`);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('name', 'Luis');
        });

        test('Debe retornar 404 al eliminar doctor inexistente', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const response = await request(app).delete(`/api/doctores/${fakeId}`);
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Doctor not found');
        });
    });


});
