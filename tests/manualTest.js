/**
 * Manual test script for Chitkara Qualifier API
 * Run this after starting the server to verify all endpoints work correctly
 *
 * Usage: node tests/manualTest.js
 */

const http = require('http');

const BASE_URL = 'localhost';
const PORT = process.env.PORT || 3000;

// ANSI color codes for pretty output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
};

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         Chitkara Qualifier API - Manual Tests              ║');
  console.log('╚════════════════════════════════════════════════════════════\n');

  let passed = 0;
  let failed = 0;

  // Test 1: Health Check
  try {
    log.info('Testing GET /health...');
    const response = await makeRequest('/health');

    if (response.status === 200 && response.data.is_success === true) {
      log.success('Health check passed');
      passed++;
    } else {
      log.error('Health check failed - unexpected response');
      console.log('  Response:', response.data);
      failed++;
    }
  } catch (error) {
    log.error(`Health check failed - ${error.message}`);
    failed++;
  }

  // Test 2: Fibonacci
  try {
    log.info('Testing POST /bfhl (fibonacci)...');
    const response = await makeRequest('/bfhl', 'POST', { fibonacci: 7 });

    const expected = [0, 1, 1, 2, 3, 5, 8];
    if (
      response.status === 200 &&
      response.data.is_success === true &&
      JSON.stringify(response.data.data) === JSON.stringify(expected)
    ) {
      log.success('Fibonacci test passed');
      passed++;
    } else {
      log.error('Fibonacci test failed - unexpected response');
      console.log('  Expected:', expected);
      console.log('  Got:', response.data.data);
      failed++;
    }
  } catch (error) {
    log.error(`Fibonacci test failed - ${error.message}`);
    failed++;
  }

  // Test 3: Prime Filter
  try {
    log.info('Testing POST /bfhl (prime)...');
    const response = await makeRequest('/bfhl', 'POST', {
      prime: [2, 4, 7, 9, 11],
    });

    const expected = [2, 7, 11];
    if (
      response.status === 200 &&
      response.data.is_success === true &&
      JSON.stringify(response.data.data) === JSON.stringify(expected)
    ) {
      log.success('Prime filter test passed');
      passed++;
    } else {
      log.error('Prime filter test failed - unexpected response');
      console.log('  Expected:', expected);
      console.log('  Got:', response.data.data);
      failed++;
    }
  } catch (error) {
    log.error(`Prime filter test failed - ${error.message}`);
    failed++;
  }

  // Test 4: LCM
  try {
    log.info('Testing POST /bfhl (lcm)...');
    const response = await makeRequest('/bfhl', 'POST', { lcm: [12, 18, 24] });

    if (
      response.status === 200 &&
      response.data.is_success === true &&
      response.data.data === 72
    ) {
      log.success('LCM test passed');
      passed++;
    } else {
      log.error('LCM test failed - unexpected response');
      console.log('  Expected: 72');
      console.log('  Got:', response.data.data);
      failed++;
    }
  } catch (error) {
    log.error(`LCM test failed - ${error.message}`);
    failed++;
  }

  // Test 5: HCF
  try {
    log.info('Testing POST /bfhl (hcf)...');
    const response = await makeRequest('/bfhl', 'POST', { hcf: [24, 36, 60] });

    if (
      response.status === 200 &&
      response.data.is_success === true &&
      response.data.data === 12
    ) {
      log.success('HCF test passed');
      passed++;
    } else {
      log.error('HCF test failed - unexpected response');
      console.log('  Expected: 12');
      console.log('  Got:', response.data.data);
      failed++;
    }
  } catch (error) {
    log.error(`HCF test failed - ${error.message}`);
    failed++;
  }

  // Test 6: Invalid input (should return 400)
  try {
    log.info('Testing POST /bfhl (invalid input)...');
    const response = await makeRequest('/bfhl', 'POST', { fibonacci: -5 });

    if (response.status === 400 && response.data.is_success === false) {
      log.success('Invalid input test passed (correctly rejected)');
      passed++;
    } else {
      log.error('Invalid input test failed - should have returned 400');
      console.log('  Status:', response.status);
      console.log('  Response:', response.data);
      failed++;
    }
  } catch (error) {
    log.error(`Invalid input test failed - ${error.message}`);
    failed++;
  }

  // Test 7: Missing operation key (should return 400)
  try {
    log.info('Testing POST /bfhl (missing operation)...');
    const response = await makeRequest('/bfhl', 'POST', { invalidKey: 123 });

    if (response.status === 400 && response.data.is_success === false) {
      log.success('Missing operation test passed (correctly rejected)');
      passed++;
    } else {
      log.error('Missing operation test failed - should have returned 400');
      console.log('  Status:', response.status);
      console.log('  Response:', response.data);
      failed++;
    }
  } catch (error) {
    log.error(`Missing operation test failed - ${error.message}`);
    failed++;
  }

  // Test 8: AI endpoint (if API key is configured)
  try {
    log.info('Testing POST /bfhl (AI)...');
    const response = await makeRequest('/bfhl', 'POST', {
      AI: 'What is the capital of France?',
    });

    if (response.status === 200 && response.data.is_success === true) {
      log.success(`AI test passed (answer: "${response.data.data}")`);
      passed++;
    } else if (response.status === 503) {
      log.warn('AI test skipped - GEMINI_API_KEY not configured');
    } else {
      log.error('AI test failed - unexpected response');
      console.log('  Response:', response.data);
      failed++;
    }
  } catch (error) {
    log.error(`AI test failed - ${error.message}`);
    failed++;
  }

  // Summary
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(`║  Tests Summary: ${colors.green}${passed} passed${colors.reset}, ${colors.red}${failed} failed${colors.reset}                    ║`);
  console.log('╚════════════════════════════════════════════════════════════\n');

  process.exit(failed > 0 ? 1 : 0);
}

// Check if server is running before starting tests
http
  .get(`http://${BASE_URL}:${PORT}/health`, (res) => {
    runTests();
  })
  .on('error', (err) => {
    console.log(`\n${colors.red}Error: Cannot connect to server at ${BASE_URL}:${PORT}${colors.reset}`);
    console.log('Please make sure the server is running: npm start\n');
    process.exit(1);
  });
