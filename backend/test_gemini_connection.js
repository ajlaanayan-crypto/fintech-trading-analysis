const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("Loaded API Key:", apiKey ? `${apiKey.substring(0, 5)}...` : "UNDEFINED");

if (!apiKey) {
    console.error("ERROR: GEMINI_API_KEY is not set in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testConnection() {
    try {
        console.log("Testing Gemini connection with gemini-2.0-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Hello!");
        const response = await result.response;
        console.log("Response:", response.text());
        console.log("SUCCESS");
    } catch (error) {
        console.error("ERROR:");
        // console.error(error);
        if (error.response) {
            console.error("Status:", error.status);
            console.error("Error Message:", error.message);
        } else {
            console.error(error);
        }
    }
}

testConnection();
