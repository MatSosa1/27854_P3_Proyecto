const request = require('supertest');
const app = require('../src/app.js');
const Medicamento = require('../src/models/Medicamento');

describe('Medicamentos API - Pruebas Unitarias con Patrón AAA', () => {
    // Limpieza de base de datos antes de cada prueba
    beforeEach(async () => {
        await Medicamento.deleteMany({});
    });

    describe('GET /api/medicamentos', () => {
        test('Debe retornar un array vacío inicialmente', async () => {
            // ARRANGE: Base de datos vacía
            
            // ACT: Realizar petición GET
            const res = await request(app).get('/api/medicamentos');
            
            // ASSERT: Verificar respuesta vacía
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([]);
        });

        test('Debe retornar todos los medicamentos registrados', async () => {
            // ARRANGE: Crear medicamentos de prueba
            await Medicamento.create([
                {
                    name: 'Paracetamol',
                    description: 'Analgésico',
                    price: 5.50,
                    quantity: 100,
                    category: 'Analgésicos',
                    laboratory: 'Bayer',
                },
                {
                    name: 'Ibuprofeno',
                    description: 'Antiinflamatorio',
                    price: 6.00,
                    quantity: 80,
                    category: 'Antiinflamatorios',
                    laboratory: 'Pfizer',
                },
            ]);
            
            // ACT: Obtener lista de medicamentos
            const res = await request(app).get('/api/medicamentos');
            
            // ASSERT: Verificar que retorna 2 medicamentos (sin importar orden)
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(2);
            const names = res.body.map(m => m.name);
            expect(names).toContain('Paracetamol');
            expect(names).toContain('Ibuprofeno');
        });
    });

    describe('POST /api/medicamentos', () => {
        test('Debe crear un nuevo medicamento con datos válidos', async () => {
            // ARRANGE: Preparar datos del nuevo medicamento
            const newMedicamento = {
                name: 'Paracetamol',
                description: 'Analgésico y antipirético',
                price: 5.50,
                quantity: 100,
                category: 'Analgésicos',
                laboratory: 'Bayer',
            };

            // ACT: Enviar petición POST
            const res = await request(app).post('/api/medicamentos').send(newMedicamento);

            // ASSERT: Verificar creación exitosa
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.name).toBe('Paracetamol');
            expect(res.body.description).toBe('Analgésico y antipirético');
            expect(res.body.price).toBe(5.50);
            expect(res.body.quantity).toBe(100);
        });

        test('Debe rechazar medicamento con datos incompletos', async () => {
            // ARRANGE: Datos inválidos (solo nombre)
            const invalidData = { name: 'Ibuprofeno' };
            
            // ACT: Intentar crear medicamento incompleto
            const res = await request(app).post('/api/medicamentos').send(invalidData);
            
            // ASSERT: Verificar error 400
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Name, Description, Price, Quantity, Category and Laboratory are required');
        });
    });

    describe('PUT /api/medicamentos/:id', () => {
        test('Debe actualizar el precio de un medicamento existente', async () => {
            // ARRANGE: Crear medicamento inicial
            const medicamento = {
                name: 'Aspirina',
                description: 'Antiinflamatorio',
                price: 3.50,
                quantity: 50,
                category: 'Antiinflamatorios',
                laboratory: 'Bayer',
            };
            const created = await request(app).post('/api/medicamentos').send(medicamento);
            const id = created.body._id;

            // ACT: Actualizar precio
            const updated = await request(app)
                .put(`/api/medicamentos/${id}`)
                .send({ price: 4.00 });

            // ASSERT: Verificar actualización de precio
            expect(updated.statusCode).toBe(200);
            expect(updated.body.price).toBe(4.00);
            expect(updated.body.name).toBe('Aspirina'); // Otros campos no cambian
        });

        test('Debe actualizar múltiples campos simultáneamente', async () => {
            // ARRANGE: Crear medicamento inicial
            const medicamento = {
                name: 'Ibuprofeno',
                description: 'Antiinflamatorio',
                price: 6.00,
                quantity: 80,
                category: 'Antiinflamatorios',
                laboratory: 'Pfizer',
            };
            const created = await request(app).post('/api/medicamentos').send(medicamento);
            const id = created.body._id;

            // ACT: Actualizar nombre, descripción y cantidad
            const updated = await request(app)
                .put(`/api/medicamentos/${id}`)
                .send({
                    name: 'Ibuprofeno 400mg',
                    description: 'Antiinflamatorio y analgésico',
                    quantity: 100,
                });

            // ASSERT: Verificar actualizaciones múltiples
            expect(updated.statusCode).toBe(200);
            expect(updated.body.name).toBe('Ibuprofeno 400mg');
            expect(updated.body.description).toBe('Antiinflamatorio y analgésico');
            expect(updated.body.quantity).toBe(100);
            expect(updated.body.price).toBe(6.00); // Campo no actualizado permanece igual
        });

        test('Debe retornar 404 al actualizar medicamento inexistente', async () => {
            // ARRANGE: ID de medicamento inexistente
            const fakeId = '507f1f77bcf86cd799439011';
            
            // ACT: Intentar actualizar medicamento inexistente
            const res = await request(app)
                .put(`/api/medicamentos/${fakeId}`)
                .send({ price: 10.00 });

            // ASSERT: Verificar error 404
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Medicamento not found');
        });
    });

    describe('DELETE /api/medicamentos/:id', () => {
        test('Debe eliminar un medicamento existente', async () => {
            // ARRANGE: Crear medicamento a eliminar
            const medicamento = {
                name: 'Amoxicilina',
                description: 'Antibiótico',
                price: 8.50,
                quantity: 30,
                category: 'Antibióticos',
                laboratory: 'Pfizer',
            };
            const created = await request(app).post('/api/medicamentos').send(medicamento);
            const id = created.body._id;

            // ACT: Eliminar medicamento
            const deleted = await request(app).delete(`/api/medicamentos/${id}`);

            // ASSERT: Verificar eliminación exitosa
            expect(deleted.statusCode).toBe(200);
            expect(deleted.body.name).toBe('Amoxicilina');
            
            // Verificar que ya no existe en la base de datos
            const res = await request(app).get('/api/medicamentos');
            expect(res.body.find(m => m._id === id)).toBeUndefined();
        });

        test('Debe retornar 404 al eliminar medicamento inexistente', async () => {
            // ARRANGE: ID de medicamento inexistente
            const fakeId = '507f1f77bcf86cd799439011';
            
            // ACT: Intentar eliminar medicamento inexistente
            const res = await request(app).delete(`/api/medicamentos/${fakeId}`);

            // ASSERT: Verificar error 404
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'Medicamento not found');
        });
    });
});
