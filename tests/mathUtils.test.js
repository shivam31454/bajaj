/**
 * Unit tests for math utility functions
 * These tests can be run standalone without the server
 *
 * Usage: node tests/mathUtils.test.js
 */

const path = require('path');
const mathUtils = require('../src/utils/mathUtils');

// Simple test runner
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
    failed++;
  }
}

function assertEqual(actual, expected, message) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(
      message || `Expected ${expectedStr}, but got ${actualStr}`
    );
  }
}

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║         Math Utils Unit Tests                              ║');
console.log('╚════════════════════════════════════════════════════════════\n');

// Fibonacci tests
test('Fibonacci: 0 terms', () => {
  assertEqual(mathUtils.generateFibonacci(0), []);
});

test('Fibonacci: 1 term', () => {
  assertEqual(mathUtils.generateFibonacci(1), [0]);
});

test('Fibonacci: 2 terms', () => {
  assertEqual(mathUtils.generateFibonacci(2), [0, 1]);
});

test('Fibonacci: 7 terms', () => {
  assertEqual(mathUtils.generateFibonacci(7), [0, 1, 1, 2, 3, 5, 8]);
});

test('Fibonacci: 10 terms', () => {
  assertEqual(mathUtils.generateFibonacci(10), [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
});

// Prime tests
test('isPrime: 0 is not prime', () => {
  assertEqual(mathUtils.isPrime(0), false);
});

test('isPrime: 1 is not prime', () => {
  assertEqual(mathUtils.isPrime(1), false);
});

test('isPrime: 2 is prime', () => {
  assertEqual(mathUtils.isPrime(2), true);
});

test('isPrime: 17 is prime', () => {
  assertEqual(mathUtils.isPrime(17), true);
});

test('isPrime: 18 is not prime', () => {
  assertEqual(mathUtils.isPrime(18), false);
});

test('filterPrimes: [2,4,7,9,11]', () => {
  assertEqual(mathUtils.filterPrimes([2, 4, 7, 9, 11]), [2, 7, 11]);
});

test('filterPrimes: empty array', () => {
  assertEqual(mathUtils.filterPrimes([]), []);
});

test('filterPrimes: no primes', () => {
  assertEqual(mathUtils.filterPrimes([4, 6, 8, 9, 10]), []);
});

test('filterPrimes: all primes', () => {
  assertEqual(mathUtils.filterPrimes([2, 3, 5, 7, 11]), [2, 3, 5, 7, 11]);
});

// HCF/GCD tests
test('HCF: [24, 36, 60]', () => {
  assertEqual(mathUtils.calculateHCF([24, 36, 60]), 12);
});

test('HCF: [12, 18, 24]', () => {
  assertEqual(mathUtils.calculateHCF([12, 18, 24]), 6);
});

test('HCF: single number', () => {
  assertEqual(mathUtils.calculateHCF([42]), 42);
});

test('HCF: empty array', () => {
  assertEqual(mathUtils.calculateHCF([]), 0);
});

test('HCF: coprime numbers', () => {
  assertEqual(mathUtils.calculateHCF([7, 11, 13]), 1);
});

test('HCF: with negative numbers', () => {
  assertEqual(mathUtils.calculateHCF([-24, 36, -60]), 12);
});

// LCM tests
test('LCM: [12, 18, 24]', () => {
  assertEqual(mathUtils.calculateLCM([12, 18, 24]), 72);
});

test('LCM: [4, 6]', () => {
  assertEqual(mathUtils.calculateLCM([4, 6]), 12);
});

test('LCM: single number', () => {
  assertEqual(mathUtils.calculateLCM([42]), 42);
});

test('LCM: empty array', () => {
  assertEqual(mathUtils.calculateLCM([]), 0);
});

test('LCM: with zero', () => {
  assertEqual(mathUtils.calculateLCM([0, 5, 10]), 0);
});

test('LCM: coprime numbers', () => {
  assertEqual(mathUtils.calculateLCM([7, 11]), 77);
});

// Summary
console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log(`║  Tests Summary: ${passed} passed, ${failed} failed                      ║`);
console.log('╚════════════════════════════════════════════════════════════\n');

process.exit(failed > 0 ? 1 : 0);
