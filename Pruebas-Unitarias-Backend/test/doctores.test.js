const request = require('supertest');
const app = require('../src/app');
const Doctor = require('../src/models/Doctor');

describe('Doctores API - Pruebas Unitarias con Patrón AAA', () => {
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
                    licenseNumber: 'LIC-001'
                },
                {
                    name: 'María',
                    lastName: 'González',
                    specialty: 'Pediatría',
                    phone: '0987654322',
                    email: 'maria@hospital.com',
                    licenseNumber: 'LIC-002'
                }
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
                licenseNumber: 'LIC-12345'
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
                lastName: 'Gonzalez'
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
                licenseNumber: 'LIC-12345'
            });
            
            const duplicateDoctor = {
                name: 'Pedro',
                lastName: 'Sánchez',
                specialty: 'Pediatría',
                phone: '0998765432',
                email: 'pedro.sanchez@hospital.com',
                licenseNumber: 'LIC-12345' // Número de licencia duplicado
            };

            // ACT: Intentar crear doctor con licencia duplicada
            const response = await request(app)
                .post('/api/doctores')
                .send(duplicateDoctor);

            // ASSERT: Verificar error 409 (conflicto)
            expect(response.status).toBe(409);
        });
    });

    describe('PUT /api/doctores/:id', () => {
        test('Debe actualizar los datos de un doctor existente', async () => {
            // ARRANGE: Crear doctor inicial
            const doctor = {
                name: 'Ana',
                lastName: 'Martínez',
                specialty: 'Neurología',
                phone: '0981234567',
                email: 'ana@hospital.com',
                licenseNumber: 'LIC-999'
            };
            const created = await request(app).post('/api/doctores').send(doctor);
            const id = created.body._id;

            // ACT: Actualizar teléfono y especialidad
            const updated = await request(app)
                .put(`/api/doctores/${id}`)
                .send({ 
                    phone: '0999999999',
                    specialty: 'Neurología Pediátrica'
                });

            // ASSERT: Verificar actualización
            expect(updated.status).toBe(200);
            expect(updated.body.phone).toBe('0999999999');
            expect(updated.body.specialty).toBe('Neurología Pediátrica');
            expect(updated.body.name).toBe('Ana'); // Campos no modificados permanecen
        });

        test('Debe retornar 404 al actualizar doctor inexistente', async () => {
            // ARRANGE: ID de doctor inexistente
            const fakeId = '507f1f77bcf86cd799439011';
            
            // ACT: Intentar actualizar doctor inexistente
            const response = await request(app)
                .put(`/api/doctores/${fakeId}`)
                .send({ specialty: 'Dermatología' });

            // ASSERT: Verificar error 404
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Doctor not found');
        });
    });

    describe('DELETE /api/doctores/:id', () => {
        test('Debe eliminar un doctor existente', async () => {
            // ARRANGE: Crear doctor a eliminar
            const doctor = {
                name: 'Luis',
                lastName: 'Fernández',
                specialty: 'Oftalmología',
                phone: '0987777777',
                email: 'luis@hospital.com',
                licenseNumber: 'LIC-777'
            };
            const created = await request(app).post('/api/doctores').send(doctor);
            const id = created.body._id;

            // ACT: Eliminar doctor
            const deleted = await request(app).delete(`/api/doctores/${id}`);

            // ASSERT: Verificar eliminación exitosa
            expect(deleted.status).toBe(200);
            expect(deleted.body.name).toBe('Luis');
            
            // Verificar que ya no existe
            const response = await request(app).get('/api/doctores');
            expect(response.body.find(d => d._id === id)).toBeUndefined();
        });

        test('Debe retornar 404 al eliminar doctor inexistente', async () => {
            // ARRANGE: ID de doctor inexistente
            const fakeId = '507f1f77bcf86cd799439011';
            
            // ACT: Intentar eliminar doctor inexistente
            const response = await request(app).delete(`/api/doctores/${fakeId}`);

            // ASSERT: Verificar error 404
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Doctor not found');
        });
    });
});
