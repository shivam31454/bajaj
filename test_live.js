
const fetch = require('node-fetch');

const URL = "https://bajaj-4tkw.onrender.com/bfhl";

async function testLive() {
    console.log(`Testing Live URL: ${URL}`);

    // Test 1: AI (Expected Schema)
    try {
        console.log("\n[1] Sending { 'AI': 'What is capital of India?' }");
        const res = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "AI": "What is capital of India?" })
        });

        console.log(`Status: ${res.status}`);
        const text = await res.text();
        console.log(`Body: ${text}`);
    } catch (e) {
        console.error("Test 1 Failed:", e.message);
    }

    // Test 2: Health Check
    try {
        console.log("\n[2] Testing Health Check...");
        const res = await fetch("https://bajaj-4tkw.onrender.com/health");
        console.log(`Status: ${res.status}`);
        console.log(`Body: ${await res.text()}`);
    } catch (e) {
        console.error("Test 2 Failed:", e.message);
    }
}

testLive();
