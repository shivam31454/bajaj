const request = require('supertest');
const app = require('../src/server');
const constants = require('../src/utils/constants');

describe('API Endpoints', () => {

    describe('GET /health', () => {
        it('should return health status', async () => {
            const res = await request(app).get('/health');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('is_success', true);
            expect(res.body).toHaveProperty('official_email');
        });
    });

    describe('POST /bfhl', () => {

        // Test Fibonacci
        it('should calculate fibonacci sequence', async () => {
            const res = await request(app)
                .post('/bfhl')
                .send({ fibonacci: 5 });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('is_success', true);
            expect(res.body.data).toEqual([0, 1, 1, 2, 3]);
        });

        // Test Prime
        it('should filter prime numbers', async () => {
            const res = await request(app)
                .post('/bfhl')
                .send({ prime: [1, 2, 3, 4, 5, 6] });

            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toEqual([2, 3, 5]);
        });

        // Test LCM
        it('should calculate LCM', async () => {
            const res = await request(app)
                .post('/bfhl')
                .send({ lcm: [4, 6] });

            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toEqual(12);
        });

        // Test HCF
        it('should calculate HCF', async () => {
            const res = await request(app)
                .post('/bfhl')
                .send({ hcf: [24, 36] });

            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toEqual(12);
        });

        // Test Invalid Input
        it('should return 400 for invalid fibonacci input', async () => {
            const res = await request(app)
                .post('/bfhl')
                .send({ fibonacci: -1 });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('is_success', false);
        });

        // Test Invalid Key
        it('should return 400 for invalid operation key', async () => {
            const res = await request(app)
                .post('/bfhl')
                .send({ invalid_op: 123 });

            expect(res.statusCode).toEqual(400);
        });

        // Test Multiple Keys
        it('should return 400 for multiple keys', async () => {
            const res = await request(app)
                .post('/bfhl')
                .send({ fibonacci: 5, prime: [2, 3] });

            expect(res.statusCode).toEqual(400);
        });

        // Test AI (Assumption: No API Key in environment, should return 503)
        it('should return 503 for AI request without API key', async () => {
            // Ensure key is not set for this test
            const originalKey = constants.geminiApiKey;
            constants.geminiApiKey = '';

            const res = await request(app)
                .post('/bfhl')
                .send({ AI: 'Hello' });

            // Restore key (though likely already empty)
            constants.geminiApiKey = originalKey;

            if (!originalKey) {
                expect(res.statusCode).toEqual(503);
                expect(res.body.message).toContain('GEMINI_API_KEY missing');
            } else {
                // If key exists, it might succeed or fail with 502 depending on network/quota
                expect([200, 502]).toContain(res.statusCode);
            }
        });

    });
});
