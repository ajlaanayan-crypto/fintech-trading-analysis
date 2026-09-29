const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await geminiService.chat(message, history || []);
        res.json({ response });
    } catch (error) {
        console.error('Chat Route Error:', error);
        res.status(500).json({ error: 'Failed to process chat message' });
    }
});

module.exports = router;
