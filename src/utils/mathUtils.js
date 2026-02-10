
const generateFibonacci = (n) => {
  if (n <= 0) return [];
  if (n === 1) return [0];
  if (n === 2) return [0, 1];

  const sequence = [0, 1];
  for (let i = 2; i < n; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }
  return sequence;
};

const isPrime = (num) => {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;

  const sqrt = Math.sqrt(num);
  for (let i = 3; i <= sqrt; i += 2) {
    if (num % i === 0) return false;
  }
  return true;
};


const filterPrimes = (numbers) => {
  return numbers.filter((num) => isPrime(num));
};


const gcdTwo = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};


const calculateHCF = (numbers) => {
  if (numbers.length === 0) return 0;
  if (numbers.length === 1) return Math.abs(numbers[0]);

  return numbers.reduce((acc, num) => gcdTwo(acc, num));
};


const lcmTwo = (a, b) => {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcdTwo(a, b));
};


const calculateLCM = (numbers) => {
  if (numbers.length === 0) return 0;
  if (numbers.length === 1) return Math.abs(numbers[0]);

  return numbers.reduce((acc, num) => lcmTwo(acc, num));
};

module.exports = {
  generateFibonacci,
  isPrime,
  filterPrimes,
  calculateHCF,
  calculateLCM,
};
