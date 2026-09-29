const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function test() {
    try {
        console.log("Fetching Day Gainers (IN)...");
        const gainers = await yahooFinance.screener(
            { scrIds: 'day_gainers', count: 5, region: 'IN', lang: 'en-IN' },
            { validateResult: false } // Critical: Disable validation
        );
        console.log("Gainers Count:", gainers.quotes.length);
        console.log("Top Gainer:", gainers.quotes[0].symbol, gainers.quotes[0].shortName);

        console.log("\nFetching Day Losers (IN)...");
        const losers = await yahooFinance.screener(
            { scrIds: 'day_losers', count: 5, region: 'IN', lang: 'en-IN' },
            { validateResult: false }
        );
        console.log("Losers Count:", losers.quotes.length);
        console.log("Top Loser:", losers.quotes[0].symbol, losers.quotes[0].shortName);

    } catch (error) {
        console.error("Test failed:", error);
    }
}

test();
