const validateFibonacci = (value) => {

  if (!Number.isInteger(value)) {
    return {
      isValid: false,
      message: 'Fibonacci value must be an integer',
    };
  }

  if (value < 0) {
    return {
      isValid: false,
      message: 'Fibonacci value must be non-negative',
    };
  }
  return { isValid: true };
};

const validateNumberArray = (value, operation) => {
  if (!Array.isArray(value)) {
    return {
      isValid: false,
      message: `${operation} value must be an array of numbers`,
    };
  }

  if (value.length === 0) {
    return {
      isValid: false,
      message: `${operation} array cannot be empty`,
    };
  }

  return { isValid: true };
};

const validateAIQuestion = (value) => {
  if (typeof value !== 'string') {
    return {
      isValid: false,
      message: 'AI value must be a string',
    };
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      message: 'AI question cannot be empty',
    };
  }

  return { isValid: true };
};

const validateBFHLRequest = (body) => {
  if (!body || typeof body !== 'object') {
    return {
      isValid: false,
      message: 'Request body must be a valid JSON object',
    };
  }

  const validKeys = ['fibonacci', 'prime', 'lcm', 'hcf', 'AI'];
  const providedKeys = Object.keys(body);
  const operationKeys = providedKeys.filter((key) => validKeys.includes(key));

  if (operationKeys.length === 0) {
    return {
      isValid: false,
      message: `Request must be only one of: ${validKeys.join(', ')}`,
    };
  }

  if (operationKeys.length > 1) {
    return {
      isValid: false,
      message: 'Request must contain only one operation key',
    };
  }

  const operation = operationKeys[0];
  const value = body[operation];

  switch (operation) {
    case 'fibonacci':
      return { ...validateFibonacci(value), operation, value };

    case 'prime':
      return { ...validateNumberArray(value, 'prime'), operation, value };

    case 'lcm':
      return { ...validateNumberArray(value, 'lcm'), operation, value };

    case 'hcf':
      return { ...validateNumberArray(value, 'hcf'), operation, value };

    case 'AI':
      return { ...validateAIQuestion(value), operation, value };

    default:
      return {
        isValid: false,
        message: 'Invalid operation',
      };
  }
};

module.exports = {
  validateBFHLRequest,
  validateFibonacci,
  validateNumberArray,
  validateAIQuestion,
};
