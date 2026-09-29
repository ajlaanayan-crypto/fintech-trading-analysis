const express = require('express');
const router = express.Router();
const yahooFinanceService = require('../services/yahooFinanceService');

// GET /api/stocks/market/status
router.get('/market/status', async (req, res) => {
    try {
        const { nifty, sensex } = await yahooFinanceService.getMarketStatus();

        // Yahoo returns regularMarketPrice and regularMarketChange
        const formatIndex = (data) => {
            if (!data) return null;
            return {
                price: data.regularMarketPrice,
                change: data.regularMarketChange,
                percent: data.regularMarketChangePercent
            };
        };

        res.json({
            nifty: formatIndex(nifty),
            sensex: formatIndex(sensex)
        });
    } catch (error) {
        console.error('Error fetching market status:', error);
        res.status(500).json({ error: 'Failed to fetch market status' });
    }
});

// GET /api/stocks/search?q=query
router.get('/search', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter "q" is required' });

    try {
        const results = await yahooFinanceService.searchStocks(q);
        res.json(results);
    } catch (error) {
        console.error('Search Route Error:', error);
        res.status(500).json({ error: 'Failed to search stocks' });
    }
});

// GET /api/stocks/quote/:symbol
router.get('/quote/:symbol', async (req, res) => {
    const { symbol } = req.params;
    try {
        const quote = await yahooFinanceService.getQuote(symbol);
        res.json(quote);
    } catch (error) {
        console.error('Quote Route Error:', error);
        res.status(500).json({ error: 'Failed to get stock quote' });
    }
});

// GET /api/stocks/history/:symbol?range=1mo
router.get('/history/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const { range } = req.query; // Get range from query strings
    try {
        const history = await yahooFinanceService.getHistory(symbol, range || '1mo');
        res.json(history);
    } catch (error) {
        console.error('History Route Error:', error);
        res.status(500).json({ error: 'Failed to get stock history' });
    }
});

// GET /api/stocks/trending
router.get('/trending', async (req, res) => {
    try {
        const trending = await yahooFinanceService.getTrending();
        res.json(trending);
    } catch (error) {
        console.error('Trending Route Error:', error);
        res.status(500).json({ error: 'Failed to get trending stocks' });
    }
});

// GET /api/stocks/leaders
router.get('/leaders', async (req, res) => {
    try {
        const leaders = await yahooFinanceService.getMarketLeaders();
        res.json(leaders);
    } catch (error) {
        console.error('Leaders Route Error:', error);
        res.status(500).json({ error: 'Failed to get market leaders' });
    }
});

// GET /api/stocks/news/general
router.get('/news/general', async (req, res) => {
    try {
        const news = await yahooFinanceService.getGeneralNews();
        res.json(news);
    } catch (error) {
        console.error('General News Route Error:', error);
        res.status(500).json({ error: 'Failed to get general news' });
    }
});

// GET /api/stocks/news/:symbol
router.get('/news/:symbol', async (req, res) => {
    const { symbol } = req.params;
    try {
        const news = await yahooFinanceService.getNews(symbol);
        res.json(news);
    } catch (error) {
        console.error('News Route Error:', error);
        res.status(500).json({ error: 'Failed to get stock news' });
    }
});

// Simple in-memory cache for AI reasons: { symbol: { reason: "...", timestamp: 12345 } }
const aiReasonCache = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// GET /api/stocks/movers?type=gainers|losers
router.get('/movers', async (req, res) => {
    try {
        const geminiService = require('../services/geminiService');
        const { gainers, losers } = await yahooFinanceService.getMovers();

        // Helper to add reason with caching
        const addReason = async (item) => {
            if (!item) return;

            // Check cache first
            const cached = aiReasonCache[item.symbol];
            if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
                item.reason = cached.reason;
                return;
            }

            try {
                const news = await yahooFinanceService.getNews(item.symbol);
                if (!news || news.length === 0) {
                    item.reason = "No specific news found.";
                    return;
                }
                const headlines = news.slice(0, 3).map(n => n.title).join(". ");
                const prompt = `Stock ${item.symbol} is moving by ${item.percent.toFixed(2)}%. Recent news: "${headlines}". Explain why it is moving in one short sentence.`;
                const reason = await geminiService.chat(prompt);

                // Update item and cache
                item.reason = reason;
                aiReasonCache[item.symbol] = { reason, timestamp: Date.now() };

            } catch (e) {
                console.error(`AI Reason failed for ${item.symbol}:`, e);
                item.reason = "Analysis unavailable.";
            }
        };

        // Parallelize reason fetching for Top 1 Gainer and Top 1 Loser
        await Promise.all([
            addReason(gainers[0]),
            addReason(losers[0])
        ]);

        res.json({ gainers, losers });
    } catch (error) {
        console.error('Movers Route Error:', error);
        res.status(500).json({ error: 'Failed to fetch movers' });
    }
});

// GET /api/stocks/analyze-news/:symbol
router.get('/analyze-news/:symbol', async (req, res) => {
    const { symbol } = req.params;
    try {
        const geminiService = require('../services/geminiService');
        const news = await yahooFinanceService.getNews(symbol);

        if (!news || news.length === 0) {
            return res.json({ summary: "No recent news available to analyze.", sentiment: "Neutral" });
        }

        const headlines = news.slice(0, 5).map(n => `- ${n.title} (${new Date(n.providerPublishTime * 1000).toDateString()})`).join("\n");
        const prompt = `Analyze the following news headlines for ${symbol} and provide a concise summary (max 2 sentences) of the overall market sentiment and key drivers. \n\nHeadlines:\n${headlines}\n\nOutput format:\nSummary: [Your summary]\nSentiment: [Bullish/Bearish/Neutral]`;

        const response = await geminiService.chat(prompt);

        // Simple parsing of the response
        const summaryMatch = response.match(/Summary:\s*(.*)/i);
        const sentimentMatch = response.match(/Sentiment:\s*(.*)/i);

        res.json({
            summary: summaryMatch ? summaryMatch[1].trim() : response,
            sentiment: sentimentMatch ? sentimentMatch[1].trim() : "Neutral"
        });

    } catch (error) {
        console.error('Analyze News Route Error:', error);
        res.status(500).json({ error: 'Failed to analyze news' });
    }
});

module.exports = router;
