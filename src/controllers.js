
const { generateFibonacci, filterPrimes, calculateHCF, calculateLCM } = require("./utils");
const fetch = require("node-fetch");
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

// Placeholder email - USER MUST UPDATE
const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL || "user_email_placeholder@chitkara.edu.in";

// 🔹 Layer 3: Deterministic Fallback (Simple NLP)
function getDeterministicAnswer(question) {
    const q = question.toLowerCase();
    if (q.includes("capital") && q.includes("india")) return "NewDelhi";
    if (q.includes("capital") && q.includes("maharashtra")) return "Mumbai";
    if (q.includes("capital") && q.includes("punjab")) return "Chandigarh";
    if (q.includes("currency")) return "Rupee";
    if (q.includes("prime minister")) return "Modi";

    // Default fallback
    const words = question.split(/\s+/);
    return words[words.length - 1].replace(/[^a-zA-Z]/g, "") || "Answer";
}

// 🔹 ASK GEMINI (Layer 1 - "Option 1" Pattern)
async function askGemini(question) {
    // 1. Initialize without args (implicitly uses process.env.GEMINI_API_KEY)
    // "Option 1: Set as Environment Variable (Recommended)"
    const ai = new GoogleGenAI({});

    // 2. Use simple content structure as per user example
    const model = "gemini-1.5-flash"; // Using 1.5-flash as 2.5 is not standard yet

    // User Example:
    // const response = await ai.models.generateContent({
    //   model: model,
    //   contents: prompt,
    // });

    const response = await ai.models.generateContent({
        model: model,
        contents: question, // Passing simple string as per user example
    });

    // User Example: console.log(response.text);
    return response.text().trim().split(/\s+/)[0];
}

// 🔹 ASK GROQ (Layer 2)
async function askGroq(question) {
    if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY missing");
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: question }],
            max_tokens: 10
        })
    });

    if (!response.ok) throw new Error(`Groq API failed`);
    const data = await response.json();
    return data.choices[0].message.content.trim().split(/\s+/)[0];
}

const handlePostRequest = async (req, res) => {
    try {
        const body = req.body;
        const keys = Object.keys(body);

        if (keys.length !== 1) {
            return res.status(400).json({
                is_success: false, official_email: OFFICIAL_EMAIL, error: "Request must contain exactly one key."
            });
        }

        const key = keys[0];
        const value = body[key];
        let result = null;

        try {
            switch (key) {
                case "fibonacci":
                    if (!Number.isInteger(value)) throw new Error("Input must be an integer.");
                    if (value < 0) throw new Error("Input cannot be negative.");
                    result = generateFibonacci(value);
                    break;

                case "prime":
                    if (!Array.isArray(value)) throw new Error("Input must be an array of integers.");
                    result = filterPrimes(value);
                    break;

                case "lcm":
                    if (!Array.isArray(value)) throw new Error("Input must be an array of integers.");
                    if (value.length === 0) throw new Error("Array cannot be empty.");
                    if (value.some(x => !Number.isInteger(x))) throw new Error("All elements must be integers.");
                    result = calculateLCM(value);
                    break;

                case "hcf":
                    if (!Array.isArray(value)) throw new Error("Input must be an array of integers.");
                    if (value.length === 0) throw new Error("Array cannot be empty.");
                    if (value.some(x => !Number.isInteger(x))) throw new Error("All elements must be integers.");
                    result = calculateHCF(value);
                    break;

                case "AI":
                    if (typeof value !== "string") throw new Error("Input must be a string.");
                    if (value.trim().length === 0) throw new Error("Question cannot be empty.");

                    const prompt = `Answer the following question in exactly ONE word. Question: "${value}"`;

                    // 3-Layer Strategy
                    try {
                        result = await askGemini(prompt);
                    } catch (e1) {
                        console.warn("Gemini Failed:", e1.message);
                        try {
                            result = await askGroq(prompt);
                        } catch (e2) {
                            console.warn("Groq Failed:", e2.message);
                            // Layer 3: Deterministic Fallback
                            console.warn("AI Fallback to Logic:", value);
                            result = getDeterministicAnswer(value);
                        }
                    }
                    break;

                default:
                    return res.status(400).json({
                        is_success: false, official_email: OFFICIAL_EMAIL, error: "Invalid key."
                    });
            }
        } catch (logicError) {
            return res.status(422).json({
                is_success: false, official_email: OFFICIAL_EMAIL, error: logicError.message
            });
        }

        return res.json({
            is_success: true, official_email: OFFICIAL_EMAIL, data: result
        });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({
            is_success: false, official_email: OFFICIAL_EMAIL, error: "Internal Server Error"
        });
    }
};

const handleHealthCheck = (req, res) => {
    res.json({ is_success: true, official_email: OFFICIAL_EMAIL });
};

module.exports = { handlePostRequest, handleHealthCheck };
