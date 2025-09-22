const request = require('supertest');
const app = require('../../index'); // Express-App importieren

describe('Unit Test: / endpoint', () => {
    it('sollte 200 und den Hello World Text zurückgeben', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.text).toBe('Hello World v3 ');
    });
});
