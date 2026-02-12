const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

// Configurar la URI de MongoDB para pruebas
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hospital-test';
process.env.JWT_SECRET = 'hospital_secret_test_key';

describe('Auth Routes', () => {
    let testUser;

    // Conectar a MongoDB antes de las pruebas
    beforeAll(async () => {
        try {
            if (mongoose.connection.readyState === 0) {
                await mongoose.connect(process.env.MONGO_URI);
            }
            // Limpiar la colección de usuarios antes de las pruebas
            await User.deleteMany({});
        } catch (error) {
            console.error('Error connecting to MongoDB for tests:', error);
        }
    });

    // Limpiar después de cada prueba
    afterEach(async () => {
        try {
            await User.deleteMany({});
        } catch (error) {
            console.error('Error cleaning up after tests:', error);
        }
    });

    // Cerrar la conexión después de todas las pruebas
    afterAll(async () => {
        try {
            if (mongoose.connection.readyState === 1) {
                await mongoose.connection.close();
            }
        } catch (error) {
            console.error('Error closing MongoDB connection:', error);
        }
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    firstName: 'John',
                    lastName: 'Doe',
                    role: 'patient',
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
            expect(res.body.user.email).toBe('test@example.com');
            expect(res.body.user.password).toBeUndefined();
        });

        it('should not register a user without all required fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should not register a user if email already exists', async () => {
            // First registration
            await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'duplicate@example.com',
                    password: 'password123',
                    firstName: 'John',
                    lastName: 'Doe',
                });

            // Second registration with same email
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'duplicate@example.com',
                    password: 'password456',
                    firstName: 'Jane',
                    lastName: 'Smith',
                });

            expect(res.status).toBe(409);
            expect(res.body.success).toBe(false);
        });

        it('should not register a user with short password', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'shortpass@example.com',
                    password: '123',
                    firstName: 'John',
                    lastName: 'Doe',
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Crear un usuario de prueba
            const newUser = new User({
                email: 'login@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                role: 'patient',
            });
            testUser = await newUser.save();
        });

        it('should login successfully with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
            expect(res.body.user.email).toBe('login@example.com');
        });

        it('should not login with wrong password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'wrongpassword',
                });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should not login with non-existent user', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should not login without credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/auth/profile', () => {
        let token;

        beforeEach(async () => {
            // Crear un usuario de prueba
            const newUser = new User({
                email: 'profile@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                role: 'patient',
            });
            testUser = await newUser.save();

            // Obtener un token válido
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'profile@example.com',
                    password: 'password123',
                });
            token = loginRes.body.token;
        });

        it('should get profile with valid token', async () => {
            const res = await request(app)
                .get('/api/auth/profile')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user.email).toBe('profile@example.com');
        });

        it('should not get profile without token', async () => {
            const res = await request(app)
                .get('/api/auth/profile');

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should not get profile with invalid token', async () => {
            const res = await request(app)
                .get('/api/auth/profile')
                .set('Authorization', 'Bearer invalidtoken');

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('PUT /api/auth/profile', () => {
        let token;

        beforeEach(async () => {
            // Crear un usuario de prueba
            const newUser = new User({
                email: 'update@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                role: 'patient',
            });
            testUser = await newUser.save();

            // Obtener un token válido
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'update@example.com',
                    password: 'password123',
                });
            token = loginRes.body.token;
        });

        it('should update profile with valid data', async () => {
            const res = await request(app)
                .put('/api/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    firstName: 'Jane',
                    lastName: 'Smith',
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user.firstName).toBe('Jane');
            expect(res.body.user.lastName).toBe('Smith');
        });
    });

    describe('POST /api/auth/change-password', () => {
        let token;

        beforeEach(async () => {
            // Crear un usuario de prueba
            const newUser = new User({
                email: 'changepass@example.com',
                password: 'oldpassword123',
                firstName: 'John',
                lastName: 'Doe',
                role: 'patient',
            });
            testUser = await newUser.save();

            // Obtener un token válido
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'changepass@example.com',
                    password: 'oldpassword123',
                });
            token = loginRes.body.token;
        });

        it('should change password successfully', async () => {
            const res = await request(app)
                .post('/api/auth/change-password')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    currentPassword: 'oldpassword123',
                    newPassword: 'newpassword456',
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);

            // Verify the new password works
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'changepass@example.com',
                    password: 'newpassword456',
                });

            expect(loginRes.status).toBe(200);
            expect(loginRes.body.success).toBe(true);
        });

        it('should not change password with wrong current password', async () => {
            const res = await request(app)
                .post('/api/auth/change-password')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    currentPassword: 'wrongpassword',
                    newPassword: 'newpassword456',
                });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});
