const request = require('supertest');
const app = require('../app');
const UserModel = require('../user/user.model');
const { connectTestDB, clearTestDB, closeTestDB } = require('./database');

jest.setTimeout(120_000); // 2 minutes

describe('Auth API', () => {
    beforeAll(connectTestDB);
    afterEach(clearTestDB);
    afterAll(closeTestDB);

    test('POST /v1/auth/register returns a token and persists a hashed password', async () => {
        const payload = {
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: 'password123'
        };

        const response = await request(app)
            .post('/v1/auth/register')
            .send(payload);

        expect(response.statusCode).toBe(201);
        expect(response.body.token).toEqual(expect.any(String));
        expect(response.body.user).toMatchObject({
            name: payload.name,
            email: payload.email
        });
        expect(response.body.user).not.toHaveProperty('password');

        const savedUser = await UserModel.findOne({ email: payload.email }).lean();

        expect(savedUser).not.toBeNull();
        expect(savedUser.password).not.toBe(payload.password);
        expect(savedUser.password).toMatch(/^\$2[aby]\$/);
    });

    test('POST /v1/auth/login returns a token for valid credentials', async () => {
        const payload = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
        };

        await request(app)
            .post('/v1/auth/register')
            .send(payload);

        const response = await request(app)
            .post('/v1/auth/login')
            .send({ email: payload.email, password: payload.password });

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toEqual(expect.any(String));
        expect(response.body.user).toMatchObject({
            name: payload.name,
            email: payload.email
        });
        expect(response.body.user).not.toHaveProperty('password');
    });

    test('POST /v1/auth/login returns the current error response for invalid credentials', async () => {
        await request(app)
            .post('/v1/auth/register')
            .send({
                name: 'Mary Doe',
                email: 'mary@example.com',
                password: 'password123'
            });

        const response = await request(app)
            .post('/v1/auth/login')
            .send({ email: 'mary@example.com', password: 'wrongpass' });

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
    });
});
