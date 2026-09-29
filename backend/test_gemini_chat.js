const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
// Using the model we believe works
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function testChat() {
    try {
        console.log("Testing Gemini StartChat...");

        // Simulate a simple history
        const history = [
            { role: 'user', content: 'Hello' },
            { role: 'model', content: 'Hi there!' }
        ];

        // Map it like the service does
        const geminiHistory = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const chat = model.startChat({
            history: geminiHistory,
            generationConfig: {
                maxOutputTokens: 200,
            },
        });

        const result = await chat.sendMessage("How are you?");
        const response = await result.response;
        console.log("Chat Response:", response.text());
        console.log("SUCCESS");

    } catch (error) {
        console.error("ERROR in Chat:");
        if (error.response) {
            console.error("Status:", error.status);
            console.error("Message:", error.message);
        } else {
            console.error(error);
        }
    }
}

testChat();
