const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function test() {
    try {
        console.log("Testing trendingSymbols('IN')...");
        const result = await yahooFinance.trendingSymbols('IN');
        console.log("Trending count:", result.quotes.length);
        console.log(JSON.stringify(result.quotes, null, 2));
    } catch (e) {
        console.log("Trending failed:", e.message);
    }
}

test();
