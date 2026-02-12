const request = require('supertest');
const app = require('../src/app.js');
const Paciente = require('../src/models/Paciente');

describe('Pacientes API - Pruebas Unitarias con Patrón AAA', () => {
    // Limpieza de base de datos antes de cada prueba
    beforeEach(async () => {
        await Paciente.deleteMany({});
    });

    describe('GET /api/pacientes', () => {
        test('Debe retornar una lista vacía inicialmente', async () => {
            // ARRANGE: No hay datos iniciales
            
            // ACT: Realizar petición GET
            const res = await request(app).get('/api/pacientes');
            
            // ASSERT: Verificar respuesta
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([]);
        });

        test('Debe retornar todos los pacientes existentes', async () => {
            // ARRANGE: Crear pacientes de prueba
            await Paciente.create([
                { name: 'Juan', lastName: 'Pérez', email: 'juan@test.com', gender: 'Masculino', illness: 'Gripe' },
                { name: 'María', lastName: 'López', email: 'maria@test.com', gender: 'Femenino', illness: 'Fiebre' },
            ]);
            
            // ACT: Realizar petición GET
            const res = await request(app).get('/api/pacientes');
            
            // ASSERT: Verificar que retorna 2 pacientes (sin importar orden)
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(2);
            const names = res.body.map(p => p.name);
            expect(names).toContain('Juan');
            expect(names).toContain('María');
        });
    });

    describe('POST /api/pacientes', () => {
        test('Debe crear un nuevo paciente con datos válidos', async () => {
            // ARRANGE: Preparar datos del nuevo paciente
            const newPatient = {
                name: 'Juan',
                lastName: 'Perez',
                email: 'juanperez@example.com',
                gender: 'Masculino',
                illness: 'Gripe',
            };

            // ACT: Enviar petición POST
            const res = await request(app).post('/api/pacientes').send(newPatient);

            // ASSERT: Verificar que se creó correctamente
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.name).toBe('Juan');
            expect(res.body.lastName).toBe('Perez');
            expect(res.body.email).toBe('juanperez@example.com');
        });

        test('Debe rechazar paciente con datos incompletos', async () => {
            // ARRANGE: Datos inválidos (faltan campos requeridos)
            const invalidPatient = { name: 'Carlos' };
            
            // ACT: Intentar crear paciente
            const res = await request(app).post('/api/pacientes').send(invalidPatient);
            
            // ASSERT: Verificar error 400
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Name, Last Name, Email, Gender and Illness are required');
        });
    });

    describe('PUT /api/pacientes/:id', () => {
        test('Debe actualizar un paciente existente', async () => {
            // ARRANGE: Crear paciente inicial
            const patient = {
                name: 'Ana',
                lastName: 'Lopez',
                email: 'analopez@example.com',
                gender: 'Femenino',
                illness: 'Fiebre',
            };
            const created = await request(app).post('/api/pacientes').send(patient);
            const id = created.body._id;

            // ACT: Actualizar enfermedad del paciente
            const updated = await request(app)
                .put(`/api/pacientes/${id}`)
                .send({ illness: 'Migraña' });

            // ASSERT: Verificar actualización
            expect(updated.statusCode).toBe(200);
            expect(updated.body.illness).toBe('Migraña');
            expect(updated.body.name).toBe('Ana'); // Otros campos no cambian
        });

        test('Debe actualizar múltiples campos simultáneamente', async () => {
            // ARRANGE: Crear paciente inicial
            const patient = {
                name: 'Pedro',
                lastName: 'Garcia',
                email: 'pedro@example.com',
                gender: 'Masculino',
                illness: 'Diabetes',
            };
            const created = await request(app).post('/api/pacientes').send(patient);
            const id = created.body._id;

            // ACT: Actualizar múltiples campos
            const updated = await request(app)
                .put(`/api/pacientes/${id}`)
                .send({
                    name: 'Pedro Luis',
                    lastName: 'Garcia Perez',
                    email: 'pedroluis@example.com',
                });

            // ASSERT: Verificar todas las actualizaciones
            expect(updated.statusCode).toBe(200);
            expect(updated.body.name).toBe('Pedro Luis');
            expect(updated.body.lastName).toBe('Garcia Perez');
            expect(updated.body.email).toBe('pedroluis@example.com');
            expect(updated.body.illness).toBe('Diabetes'); // Campo no actualizado permanece igual
        });

        test('Debe retornar 404 si el paciente no existe', async () => {
            // ARRANGE: ID de paciente inexistente
            const fakeId = '507f1f77bcf86cd799439011';
            
            // ACT: Intentar actualizar paciente inexistente
            const res = await request(app)
                .put(`/api/pacientes/${fakeId}`)
                .send({ illness: 'Gripe' });

            // ASSERT: Verificar error 404
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Patient not found');
        });
    });

    describe('DELETE /api/pacientes/:id', () => {
        test('Debe eliminar un paciente existente', async () => {
            // ARRANGE: Crear paciente a eliminar
            const patient = {
                name: 'Carlos',
                lastName: 'Perez',
                email: 'carlosperez@example.com',
                gender: 'Masculino',
                illness: 'Alergia',
            };
            const created = await request(app).post('/api/pacientes').send(patient);
            const id = created.body._id;

            // ACT: Eliminar paciente
            const deleted = await request(app).delete(`/api/pacientes/${id}`);

            // ASSERT: Verificar eliminación exitosa
            expect(deleted.statusCode).toBe(200);
            expect(deleted.body.name).toBe('Carlos');
            
            // Verificar que ya no existe en la base de datos
            const res = await request(app).get('/api/pacientes');
            expect(res.body.find(p => p._id === id)).toBeUndefined();
        });

        test('Debe retornar 404 al eliminar paciente inexistente', async () => {
            // ARRANGE: ID de paciente inexistente
            const fakeId = '507f1f77bcf86cd799439011';
            
            // ACT: Intentar eliminar paciente inexistente
            const res = await request(app).delete(`/api/pacientes/${fakeId}`);

            // ASSERT: Verificar error 404
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Patient not found');
        });
    });
});
