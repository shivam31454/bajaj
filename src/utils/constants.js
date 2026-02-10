const constants = {
    port: process.env.PORT || 3000,
    email: process.env.OFFICIAL_EMAIL || 'darshit1171.be23@chitkarauniversity.edu.in',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    groqApiKey: process.env.GROQ_API_KEY || '',
};

module.exports = constants;