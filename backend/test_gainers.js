const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function test() {
    try {
        console.log("Testing dailyGainers...");
        // This is a guess, let's see if it exists or if we need to use screener
        // Often keys are 'day_gainers', 'day_losers' in screener predefined modules

        try {
            const gainers = await yahooFinance.dailyGainers ? await yahooFinance.dailyGainers() : "Function not found";
            console.log("Gainers:", gainers ? "Found" : "Not Found");
        } catch (e) {
            console.log("dailyGainers failed:", e.message);
        }

        console.log("Testing screener...");
        try {
            // https://github.com/gadicc/node-yahoo-finance2/blob/devel/docs/modules/screener.md
            // predefined: day_gainers, day_losers
            const screamGainers = await yahooFinance.screener({ scrIds: 'day_gainers', count: 5, region: 'IN' });
            console.log("Screener Gainers:", screamGainers.quotes.length);
            console.log(screamGainers.quotes[0]);

            const screamLosers = await yahooFinance.screener({ scrIds: 'day_losers', count: 5, region: 'IN' });
            console.log("Screener Losers:", screamLosers.quotes.length);
        } catch (e) {
            console.log("Screener failed:", e.message);
        }

    } catch (error) {
        console.error("Test failed:", error);
    }
}

test();
