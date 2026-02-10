const { GoogleGenerativeAI } = require('@google/generative-ai');
const constants = require('./constants');

let genAI = null;
let model = null;

const ensureInitialized = () => {
  if (genAI) return;

  if (!constants.geminiApiKey) {
    throw new Error('Gemini API Key is missing in configuration');
  }

  try {
    genAI = new GoogleGenerativeAI(constants.geminiApiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
  } catch (error) {
    console.error('Failed to initialize AI Service:', error.message);
    throw new Error('AI Service initialization failed');
  }
};

const getSingleWordAnswer = async (question) => {
  if (!question || typeof question !== 'string') {
    throw new Error('Invalid question provided');
  }

  ensureInitialized();

  const prompt = `Answer the following question with exactly one word. Question: "${question.trim()}"`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) return '';

    // Extract first word, remove non-alphanumeric characters, and normalize
    return text.trim()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)[0]
      .toLowerCase();

  } catch (error) {
    console.error('AI Generation Error:', error.message);
    throw new Error('Failed to generate answer from AI service');
  }
};

module.exports = {
  getSingleWordAnswer,
};
