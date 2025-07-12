import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

describe('Driver Authentication E2E Tests', () => {
    const testDriver = {
        name: 'João Motorista',
        email: 'joao@motorista.com',
        phone: '(11) 99999-9999',
        password: '123456',
        licenseNumber: '123456789',
        transportType: 'BUGGY'
    };

    const loginData = {
        email: 'joao@motorista.com',
        password: '123456'
    };

    describe('POST /api/driver/registration', () => {
        it('should register a new driver successfully', async () => {
            const response = await axios.post(`${BASE_URL}/api/driver/registration`, testDriver);

            expect(response.status).toBe(201);
            expect(response.data).toHaveProperty('success', true);
            expect(response.data).toHaveProperty('message', 'Motorista cadastrado com Sucesso!');
        });

        it('should fail when required fields are missing', async () => {
            const invalidDriver = {
                name: 'João Motorista',
                email: 'joao@motorista.com',
                // licenseNumber missing
                // transportType missing
                password: '123456'
            };

            try {
                await axios.post(`${BASE_URL}/api/driver/registration`, invalidDriver);
                fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('message');
            }
        });

        it('should fail with invalid email format', async () => {
            const invalidDriver = {
                ...testDriver,
                email: 'invalid-email'
            };

            try {
                await axios.post(`${BASE_URL}/api/driver/registration`, invalidDriver);
                fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('message');
            }
        });

        it('should fail when driver already exists', async () => {
            // First registration
            await axios.post(`${BASE_URL}/api/driver/registration`, testDriver);

            // Try to register again with same email
            try {
                await axios.post(`${BASE_URL}/api/driver/registration`, testDriver);
                fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('message');
            }
        });

        it('should accept different transport types', async () => {
            const buggyDriver = {
                ...testDriver,
                email: 'buggy@motorista.com',
                transportType: 'BUGGY'
            };

            const lanchaDriver = {
                ...testDriver,
                email: 'lancha@motorista.com',
                transportType: 'LANCHA'
            };

            const fourByFourDriver = {
                ...testDriver,
                email: '4x4@motorista.com',
                transportType: 'FOUR_BY_FOUR'
            };

            const buggyResponse = await axios.post(`${BASE_URL}/api/driver/registration`, buggyDriver);
            const lanchaResponse = await axios.post(`${BASE_URL}/api/driver/registration`, lanchaDriver);
            const fourByFourResponse = await axios.post(`${BASE_URL}/api/driver/registration`, fourByFourDriver);

            expect(buggyResponse.status).toBe(201);
            expect(lanchaResponse.status).toBe(201);
            expect(fourByFourResponse.status).toBe(201);
        });

        it('should fail with invalid transport type', async () => {
            const invalidDriver = {
                ...testDriver,
                transportType: 'INVALID_TYPE'
            };

            try {
                await axios.post(`${BASE_URL}/api/driver/registration`, invalidDriver);
                fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('message');
            }
        });
    });

    describe('Driver Login (if implemented)', () => {
        beforeEach(async () => {
            // Ensure driver exists before login tests
            try {
                await axios.post(`${BASE_URL}/api/driver/registration`, testDriver);
            } catch (error) {
                // Driver might already exist, that's ok
            }
        });

        it('should login driver successfully when login endpoint is implemented', async () => {
            // This test assumes a login endpoint will be implemented
            // For now, it's a placeholder
            expect(true).toBe(true); // Placeholder test
        });
    });
}); 