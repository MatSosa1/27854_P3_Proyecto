const request = require('supertest');
const app = require('../src/app.js');
const Especialidad = require('../src/models/Especialidad');

describe('Especialidades API - Pruebas Unitarias con Patrón AAA', () => {
    // Limpieza de base de datos antes de cada prueba
    beforeEach(async () => {
        await Especialidad.deleteMany({});
    });

    describe('GET /api/especialidades', () => {
        test('Debe retornar un array vacío inicialmente', async () => {
            // ARRANGE: Base de datos vacía
            
            // ACT: Realizar petición GET
            const res = await request(app).get('/api/especialidades');
            
            // ASSERT: Verificar respuesta vacía
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([]);
        });

        test('Debe retornar todas las especialidades registradas', async () => {
            // ARRANGE: Crear especialidades de prueba
            await Especialidad.create([
                { name: 'Cardiología' },
                { name: 'Pediatría' },
                { name: 'Neurología' },
            ]);
            
            // ACT: Obtener lista de especialidades
            const res = await request(app).get('/api/especialidades');
            
            // ASSERT: Verificar que retorna 3 especialidades (sin importar orden)
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(3);
            const names = res.body.map(e => e.name);
            expect(names).toContain('Cardiología');
            expect(names).toContain('Pediatría');
            expect(names).toContain('Neurología');
        });
    });

    describe('POST /api/especialidades', () => {
        test('Debe crear una nueva especialidad con datos válidos', async () => {
            // ARRANGE: Preparar datos de la nueva especialidad
            const newSpecialty = { name: 'Medicina General' };

            // ACT: Enviar petición POST
            const res = await request(app).post('/api/especialidades').send(newSpecialty);

            // ASSERT: Verificar creación exitosa
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.name).toBe('Medicina General');
        });

        test('Debe rechazar especialidad sin nombre', async () => {
            // ARRANGE: Datos vacíos (sin nombre)
            const invalidData = {};
            
            // ACT: Intentar crear especialidad sin nombre
            const res = await request(app).post('/api/especialidades').send(invalidData);
            
            // ASSERT: Verificar error 400
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Specialty name is required');
        });

        test('Debe rechazar especialidad duplicada (case-insensitive)', async () => {
            // ARRANGE: Crear primera especialidad
            await request(app).post('/api/especialidades').send({ name: 'Cardiology' });

            // ACT: Intentar crear especialidad duplicada (diferente capitalización)
            const res = await request(app).post('/api/especialidades').send({ name: 'cardiology' });

            // ASSERT: Verificar error 409 (conflicto)
            expect(res.statusCode).toBe(409);
            expect(res.body).toHaveProperty('message', 'Specialty already exists');
        });
    });

    describe('PUT /api/especialidades/:id', () => {
        test('Debe actualizar el nombre de una especialidad existente', async () => {
            // ARRANGE: Crear especialidad inicial
            const specialty = { name: 'Oftalmología' };
            const created = await request(app).post('/api/especialidades').send(specialty);
            const id = created.body._id;

            // ACT: Actualizar nombre de la especialidad
            const updated = await request(app)
                .put(`/api/especialidades/${id}`)
                .send({ name: 'Oftalmología Pediátrica' });

            // ASSERT: Verificar actualización
            expect(updated.statusCode).toBe(200);
            expect(updated.body.name).toBe('Oftalmología Pediátrica');
        });

        test('Debe retornar 404 al actualizar especialidad inexistente', async () => {
            // ARRANGE: ID de especialidad inexistente
            const fakeId = '507f1f77bcf86cd799439011';
            
            // ACT: Intentar actualizar especialidad inexistente
            const res = await request(app)
                .put(`/api/especialidades/${fakeId}`)
                .send({ name: 'Dermatología' });

            // ASSERT: Verificar error 404
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Specialty not found');
        });
    });

    describe('DELETE /api/especialidades/:id', () => {
        test('Debe eliminar una especialidad existente', async () => {
            // ARRANGE: Crear especialidad a eliminar
            const specialty = { name: 'Cardiología' };
            const created = await request(app).post('/api/especialidades').send(specialty);
            const id = created.body._id;

            // ACT: Eliminar especialidad
            const deleted = await request(app).delete(`/api/especialidades/${id}`);

            // ASSERT: Verificar eliminación exitosa
            expect(deleted.statusCode).toBe(200);
            expect(deleted.body.name).toBe('Cardiología');
            
            // Verificar que ya no existe en la base de datos
            const res = await request(app).get('/api/especialidades');
            expect(res.body.find(e => e._id === id)).toBeUndefined();
        });

        test('Debe retornar 404 al eliminar especialidad inexistente', async () => {
            // ARRANGE: ID de especialidad inexistente
            const fakeId = '507f1f77bcf86cd799439011';
            
            // ACT: Intentar eliminar especialidad inexistente
            const res = await request(app).delete(`/api/especialidades/${fakeId}`);

            // ASSERT: Verificar error 404
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Specialty not found');
        });
    });
});
