import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

describe('User Authentication E2E Tests', () => {
    const testUser = {
        name: 'João Silva',
        email: 'joao@test.com',
        phone: '(11) 99999-9999',
        password: '123456'
    };

    const loginData = {
        email: 'joao@test.com',
        password: '123456'
    };

    describe('POST /api/user/registration', () => {
        it('should register a new user successfully', async () => {
            const response = await axios.post(`${BASE_URL}/api/user/registration`, testUser);

            expect(response.status).toBe(201);
            expect(response.data).toHaveProperty('success', true);
            expect(response.data).toHaveProperty('message', 'Usuário cadastrado com Sucesso!');
        });

        it('should fail when required fields are missing', async () => {
            const invalidUser = {
                name: 'João Silva',
                // email missing
                phone: '(11) 99999-9999'
                // password missing
            };

            try {
                await axios.post(`${BASE_URL}/api/user/registration`, invalidUser);
                fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('message');
            }
        });

        it('should fail with invalid email format', async () => {
            const invalidUser = {
                ...testUser,
                email: 'invalid-email'
            };

            try {
                await axios.post(`${BASE_URL}/api/user/registration`, invalidUser);
                fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('message');
            }
        });

        it('should fail when user already exists', async () => {
            // First registration
            await axios.post(`${BASE_URL}/api/user/registration`, testUser);

            // Try to register again with same email
            try {
                await axios.post(`${BASE_URL}/api/user/registration`, testUser);
                fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('message');
            }
        });
    });

    describe('POST /api/user/login', () => {
        beforeEach(async () => {
            // Ensure user exists before login tests
            try {
                await axios.post(`${BASE_URL}/api/user/registration`, testUser);
            } catch (error) {
                // User might already exist, that's ok
            }
        });

        it('should login user successfully', async () => {
            const response = await axios.post(`${BASE_URL}/api/user/login`, loginData);

            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success', true);
            expect(response.data).toHaveProperty('message', 'Login realizado com Sucesso!');
            expect(response.data).toHaveProperty('user');
            expect(response.data.user).toHaveProperty('id');
            expect(response.data.user).toHaveProperty('email', loginData.email);
            expect(response.data.user).toHaveProperty('name', testUser.name);
        });

        it('should fail with missing credentials', async () => {
            const invalidLogin = {
                email: 'joao@test.com'
                // password missing
            };

            try {
                await axios.post(`${BASE_URL}/api/user/login`, invalidLogin);
                fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('message');
            }
        });

        it('should fail with wrong password', async () => {
            const wrongPassword = {
                email: 'joao@test.com',
                password: 'wrongpassword'
            };

            try {
                await axios.post(`${BASE_URL}/api/user/login`, wrongPassword);
                fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBe(401);
                expect(error.response.data).toHaveProperty('message');
            }
        });

        it('should fail with non-existent user', async () => {
            const nonExistentUser = {
                email: 'nonexistent@test.com',
                password: '123456'
            };

            try {
                await axios.post(`${BASE_URL}/api/user/login`, nonExistentUser);
                fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBe(401);
                expect(error.response.data).toHaveProperty('message');
            }
        });
    });

    describe('POST /api/user/reset-password', () => {
        beforeEach(async () => {
            // Ensure user exists
            try {
                await axios.post(`${BASE_URL}/api/user/registration`, testUser);
            } catch (error) {
                // User might already exist, that's ok
            }
        });

        it('should reset password successfully', async () => {
            const resetData = {
                email: 'joao@test.com',
                newPassword: 'newpassword123'
            };

            const response = await axios.post(`${BASE_URL}/api/user/reset-password`, resetData);

            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success', true);
            expect(response.data).toHaveProperty('message', 'Senha alterada com Sucesso!');
        });

        it('should fail with missing fields', async () => {
            const invalidReset = {
                email: 'joao@test.com'
                // newPassword missing
            };

            try {
                await axios.post(`${BASE_URL}/api/user/reset-password`, invalidReset);
                fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('message');
            }
        });

        it('should fail with non-existent user', async () => {
            const nonExistentReset = {
                email: 'nonexistent@test.com',
                newPassword: 'newpassword123'
            };

            try {
                await axios.post(`${BASE_URL}/api/user/reset-password`, nonExistentReset);
                fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBe(401);
                expect(error.response.data).toHaveProperty('message');
            }
        });
    });

    describe('POST /api/user/forgot-password', () => {
        beforeEach(async () => {
            // Ensure user exists
            try {
                await axios.post(`${BASE_URL}/api/user/registration`, testUser);
            } catch (error) {
                // User might already exist, that's ok
            }
        });

        it('should handle forgot password successfully', async () => {
            const forgotData = {
                email: 'joao@test.com'
            };

            const response = await axios.post(`${BASE_URL}/api/user/forgot-password`, forgotData);

            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('success', true);
            expect(response.data).toHaveProperty('message', 'Email de recuperação enviado!');
        });

        it('should fail with missing email', async () => {
            const invalidForgot = {};

            try {
                await axios.post(`${BASE_URL}/api/user/forgot-password`, invalidForgot);
                fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('message');
            }
        });

        it('should fail with non-existent user', async () => {
            const nonExistentForgot = {
                email: 'nonexistent@test.com'
            };

            try {
                await axios.post(`${BASE_URL}/api/user/forgot-password`, nonExistentForgot);
                fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('message');
            }
        });
    });
}); 