const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function testYahooFeatures() {
    try {
        console.log("Fetching Trending...");
        const trending = await yahooFinance.trendingSymbols('IN'); // India
        console.log("Trending:", JSON.stringify(trending, null, 2));

        console.log("\nFetching Daily Gainers...");
        const gainers = await yahooFinance.dailyGainers(); // or screener
        console.log("Gainers:", gainers ? gainers.length : 0);

        console.log("\nFetching News for RELIANCE.NS...");
        const news = await yahooFinance.search('Reliance', { newsCount: 3 });
        // Note: yahoo-finance2 search returns news in 'news' field sometimes, 
        // or check if there is a dedicated news module. 
        // Documentation says 'search' includes news.
        console.log("News Result keys:", Object.keys(news));
        if (news.news) console.log("News items:", news.news.length);

    } catch (e) {
        console.error(e);
    }
}

testYahooFeatures();
