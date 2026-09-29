const service = require('./services/yahooFinanceService');

async function testValkyrie() {
    console.log("Fetching market leaders...");
    try {
        const leaders = await service.getMarketLeaders();
        console.log("Success! Count:", leaders.length);
        if (leaders.length > 0) {
            console.log("Top Leader:", leaders[0]);
        } else {
            console.log("Returned empty array.");
        }
    } catch (e) {
        console.error("FAILED:", e);
    }
}

testValkyrie();
