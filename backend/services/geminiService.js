const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

exports.chat = async (message, history = []) => {
    try {
        console.log(`[Gemini] Received message: "${message}". History length: ${history.length}`);

        if (!process.env.GEMINI_API_KEY) {
            console.error('[Gemini] Missing API Key in environment');
            return "Thinking... (Please configure GEMINI_API_KEY in backend .env)";
        }

        // Simple history management: strictly the last few messages or just context
        // For accurate chat, we use startChat.

        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            })),
            generationConfig: {
                maxOutputTokens: 200, // Keep responses concise
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        console.log(`[Gemini] Response generated: "${text.substring(0, 50)}..."`);
        return text;
    } catch (error) {
        console.error("Gemini Chat Error Details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        return "I'm having trouble connecting to my AI brain right now. Please check the API key.";
    }
};
