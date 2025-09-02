const request = require('supertest');
const app = require('./index'); // Import the exported app

describe('GET /', () => {
  it('should respond with a 200 status code and the correct message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hello World v3 🚀');
  });
});