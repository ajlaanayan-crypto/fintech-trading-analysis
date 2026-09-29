const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

// Suppress validation errors which are annoying but harmless usually
// Suppress validation errors by passing option to method call

async function test() {
    try {
        console.log("Testing screener for India (IN)...");
        // Try passing lang and region
        const queryOptionsSource = { scrIds: 'day_gainers', count: 5, region: 'IN', lang: 'en-IN' };

        try {
            // We can suppress the strict validation error by catching it, 
            // but yahoo-finance2 throws on validation failure by default unless configured.
            // Let's try to get the result.
            const result = await yahooFinance.screener(queryOptionsSource, { validateResult: false });
            console.log("Result Count:", result.quotes.length);
            result.quotes.forEach(q => {
                console.log(`${q.symbol} (${q.fullExchangeName}) - ${q.regularMarketChangePercent}%`);
            });
        } catch (e) {
            console.log("Screener IN failed:", e.message);
            if (e.result) {
                console.log("Partial result available?");
            }
        }

    } catch (error) {
        console.error("Test failed:", error);
    }
}

test();
