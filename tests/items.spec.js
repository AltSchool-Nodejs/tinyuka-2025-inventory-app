const request = require('supertest');
const app = require('../app');
const { connectTestDB, clearTestDB, closeTestDB } = require('./database');

jest.setTimeout(120000);

const registerAndGetToken = async () => {
    const response = await request(app)
        .post('/v1/auth/register')
        .send({
            name: 'Items Tester',
            email: 'items@example.com',
            password: 'password123'
        });

    return response.body.token;
};

describe('Items API', () => {
    beforeAll(connectTestDB);
    afterEach(clearTestDB);
    afterAll(closeTestDB);

    test('rejects protected routes without a bearer token', async () => {
        const response = await request(app)
            .post('/v1/items')
            .send({
                name: 'Rice',
                quantity: 5,
                exp_date: '2027-01-01'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ message: 'Unauthorized' });
    });

    test('creates an item with a valid token', async () => {
        const token = await registerAndGetToken();
        const payload = {
            name: 'Milk',
            quantity: 2,
            exp_date: '2027-01-01'
        };

        const response = await request(app)
            .post('/v1/items')
            .set('Authorization', `Bearer ${token}`)
            .send(payload);

        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
            name: payload.name,
            quantity: payload.quantity
        });
        expect(response.body._id).toEqual(expect.any(String));
        expect(response.body.exp_date).toBe(new Date(payload.exp_date).toISOString());
    });

    test('fetches created items with a valid token', async () => {
        const token = await registerAndGetToken();

        await request(app)
            .post('/v1/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Beans',
                quantity: 3,
                exp_date: '2027-02-01'
            });

        const response = await request(app)
            .get('/v1/items')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toMatchObject({
            name: 'Beans',
            quantity: 3
        });
    });

    test('fetches a single item by id', async () => {
        const token = await registerAndGetToken();
        const createdItem = await request(app)
            .post('/v1/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Bread',
                quantity: 4,
                exp_date: '2027-03-01'
            });

        const response = await request(app)
            .get(`/v1/items/${createdItem.body._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            _id: createdItem.body._id,
            name: 'Bread',
            quantity: 4
        });
    });

    test('updates an item', async () => {
        const token = await registerAndGetToken();
        const createdItem = await request(app)
            .post('/v1/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Soap',
                quantity: 1,
                exp_date: '2027-04-01'
            });

        const response = await request(app)
            .patch(`/v1/items/${createdItem.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Bath Soap', quantity: 6 });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            _id: createdItem.body._id,
            name: 'Bath Soap',
            quantity: 6
        });
    });

    test('deletes an item', async () => {
        const token = await registerAndGetToken();
        const createdItem = await request(app)
            .post('/v1/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Juice',
                quantity: 8,
                exp_date: '2027-05-01'
            });

        const deleteResponse = await request(app)
            .delete(`/v1/items/${createdItem.body._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(deleteResponse.statusCode).toBe(200);
        expect(deleteResponse.body).toEqual({ message: 'Item deleted' });

        const getResponse = await request(app)
            .get(`/v1/items/${createdItem.body._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(getResponse.statusCode).toBe(404);
        expect(getResponse.body).toEqual({ message: 'Item not found' });
    });
});
