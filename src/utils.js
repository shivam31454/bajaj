
// Fibonacci Generator (First n terms)
const generateFibonacci = (n) => {
    if (typeof n !== 'number' || n < 0) throw new Error("Invalid input for fibonacci");
    if (n === 0) return [];
    if (n === 1) return [0];
    
    const sequence = [0, 1];
    for (let i = 2; i < n; i++) {
        sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    return sequence;
};

// Prime Checker
const isPrime = (num) => {
    if (typeof num !== 'number' || !Number.isInteger(num)) return false;
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
};

// Prime Filter
const filterPrimes = (arr) => {
    if (!Array.isArray(arr)) throw new Error("Invalid input for prime: must be array");
    // Filter non-integers and check primality
    return arr.filter(num => Number.isInteger(num) && isPrime(num));
};

// GCD (HCF) Calculation
const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
};

// Calculate HCF of array
const calculateHCF = (arr) => {
    if (!Array.isArray(arr)) throw new Error("Invalid input for hcf: must be array");
    if (arr.length === 0) return null; // Or 0 based on requirement, but usually undefined
    if (arr.length === 1) return Math.abs(arr[0]);
    
    let result = Math.abs(arr[0]);
    for (let i = 1; i < arr.length; i++) {
        result = gcd(result, arr[i]);
    }
    return result;
};

// LCM Calculation
const lcm = (a, b) => {
    if (a === 0 || b === 0) return 0;
    return Math.abs((a * b) / gcd(a, b));
};

// Calculate LCM of array
const calculateLCM = (arr) => {
    if (!Array.isArray(arr)) throw new Error("Invalid input for lcm: must be array");
    if (arr.length === 0) return null;
    if (arr.length === 1) return Math.abs(arr[0]);

    let result = Math.abs(arr[0]);
    for (let i = 1; i < arr.length; i++) {
        result = lcm(result, arr[i]);
    }
    return result;
};

module.exports = {
    generateFibonacci,
    filterPrimes,
    calculateHCF,
    calculateLCM
};
