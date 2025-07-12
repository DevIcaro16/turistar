import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

describe('Main API E2E Tests', () => {
    describe('GET /', () => {
        it('should return a welcome message', async () => {
            const response = await axios.get(`${BASE_URL}/`);

            expect(response.status).toBe(200);
            expect(response.data).toEqual({ message: 'Hello API' });
        });
    });

    describe('GET /api-docs', () => {
        it('should serve Swagger documentation', async () => {
            const response = await axios.get(`${BASE_URL}/api-docs`);

            expect(response.status).toBe(200);
            expect(response.data).toContain('swagger-ui');
        });
    });

    describe('GET /docs-json', () => {
        it('should return Swagger JSON documentation', async () => {
            const response = await axios.get(`${BASE_URL}/docs-json`);

            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('swagger');
            expect(response.data).toHaveProperty('info');
            expect(response.data).toHaveProperty('paths');
        });
    });

    describe('API Health Check', () => {
        it('should respond to health check requests', async () => {
            const response = await axios.get(`${BASE_URL}/`);

            expect(response.status).toBe(200);
            expect(response.headers).toHaveProperty('content-type');
        });
    });

    describe('CORS Headers', () => {
        it('should include CORS headers', async () => {
            const response = await axios.get(`${BASE_URL}/`);

            expect(response.headers).toHaveProperty('access-control-allow-origin');
        });
    });
}); 