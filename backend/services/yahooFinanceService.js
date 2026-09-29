const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

// Suppress some verbose notices from the library if needed
// yahooFinance.setGlobalConfig({ validation: { logErrors: false } });

exports.searchStocks = async (query) => {
    try {
        const results = await yahooFinance.search(query);
        // Filter for Indian stocks (NSE/BSE)
        return results.quotes
            .filter(q => q.isYahooFinance && (q.symbol.endsWith('.NS') || q.symbol.endsWith('.BO')))
            .map(q => ({
                symbol: q.symbol,
                name: q.shortname || q.longname || q.symbol,
                type: q.quoteType,
                region: 'IN',
                currency: 'INR'
            }));
    } catch (error) {
        console.error('Yahoo Search Error:', error);
        throw error;
    }
};

exports.getQuote = async (symbol) => {
    try {
        const quote = await yahooFinance.quote(symbol);
        return quote;
    } catch (error) {
        console.error(`Yahoo Quote Error for ${symbol}:`, error);
        throw error;
    }
};

exports.getHistory = async (symbol, range = '1mo') => {
    try {
        const period1 = new Date();
        let interval = '1d';
        let period2 = new Date(); // now

        switch (range.toLowerCase()) {
            case '1d':
                period1.setDate(period1.getDate() - 1);
                interval = '5m'; // Intraday if available
                break;
            case '5d':
                period1.setDate(period1.getDate() - 5);
                interval = '30m';
                break;
            case '1m':
                period1.setDate(period1.getDate() - 30);
                interval = '1d';
                break;
            case '6m':
                period1.setMonth(period1.getMonth() - 6);
                interval = '1d';
                break;
            case 'ytd':
                period1.setMonth(0, 1); // Jan 1st of current year
                interval = '1d';
                break;
            case '1y':
                period1.setFullYear(period1.getFullYear() - 1);
                interval = '1wk'; // Weekly for 1 year
                break;
            case '5y':
                period1.setFullYear(period1.getFullYear() - 5);
                interval = '1wk';
                break;
            case 'max':
                period1.setFullYear(1970); // Very old date for max
                interval = '1mo';
                break;
            default:
                period1.setDate(period1.getDate() - 30);
                interval = '1d';
        }

        const queryOptions = {
            period1: period1.toISOString(),
            period2: period2.toISOString(), // Explicitly set end date
            interval: interval
        };

        // For intraday (1d/5d), Yahoo sometimes needs exact timestamps
        if (['1d', '5d'].includes(range.toLowerCase())) {
            // For intraday, use timestamps to be safer
            queryOptions.period1 = Math.floor(period1.getTime() / 1000);
            queryOptions.period2 = Math.floor(period2.getTime() / 1000);
        }

        console.log(`[YahooChart] Symbol: ${symbol}, Range: ${range}, Interval: ${interval}`);

        let result = await yahooFinance.chart(symbol, queryOptions);

        // Fetch real-time quote to see if we need to append a "live" candle
        // This is useful because historical data often lags by 15-20 mins or till EOD
        try {
            const quote = await yahooFinance.quote(symbol);
            if (quote && result && result.quotes && result.quotes.length > 0) {
                const lastQuote = result.quotes[result.quotes.length - 1];
                const lastQuoteTime = new Date(lastQuote.date).getTime();
                const quoteTime = quote.regularMarketTime ? new Date(quote.regularMarketTime).getTime() : Date.now();

                // If the quote is newer than the last history point by over 1 minute
                if (quoteTime > lastQuoteTime + 60000) {
                    // console.log(`[YahooChart] Appending live quote for ${symbol}`);
                    result.quotes.push({
                        date: new Date(quoteTime),
                        open: quote.regularMarketOpen || quote.regularMarketPrice,
                        high: quote.regularMarketDayHigh || quote.regularMarketPrice,
                        low: quote.regularMarketDayLow || quote.regularMarketPrice,
                        close: quote.regularMarketPrice,
                        volume: quote.regularMarketVolume || 0,
                        adjclose: quote.regularMarketPrice
                    });
                }
            }
        } catch (err) {
            console.warn(`[YahooChart] Failed to append live quote: ${err.message}`);
        }

        return result;
    } catch (error) {
        console.warn(`Yahoo History Error for ${symbol} (${range}):`, error.message);
        return { quotes: [] };
    }
};

exports.getMarketStatus = async () => {
    try {
        // Fetch Nifty 50 and Sensex
        const [nifty, sensex] = await Promise.all([
            yahooFinance.quote('^NSEI').catch(() => null),
            yahooFinance.quote('^BSESN').catch(() => null)
        ]);
        return { nifty, sensex };
    } catch (error) {
        console.error('Yahoo Market Status Error:', error);
        return { nifty: null, sensex: null };
    }
};

exports.getTrending = async () => {
    try {
        // Try fetching trending for India
        const trending = await yahooFinance.trendingSymbols('IN');
        return trending;
    } catch (error) {
        console.warn('Yahoo Trending IN failed, using fallback Indian stocks');
        // Fallback to popular Indian stocks if API fails for 'IN' region
        return {
            quotes: [
                { symbol: 'RELIANCE.NS', longName: 'Reliance Industries Limited' },
                { symbol: 'TCS.NS', longName: 'Tata Consultancy Services' },
                { symbol: 'INFY.NS', longName: 'Infosys Limited' },
                { symbol: 'HDFCBANK.NS', longName: 'HDFC Bank Limited' },
                { symbol: 'ICICIBANK.NS', longName: 'ICICI Bank Limited' },
                { symbol: 'SBIN.NS', longName: 'State Bank of India' },
                { symbol: 'BHARTIARTL.NS', longName: 'Bharti Airtel Limited' },
                { symbol: 'ITC.NS', longName: 'ITC Limited' }
            ]
        };
    }
};

exports.getNews = async (symbol) => {
    try {
        const result = await yahooFinance.search(symbol, { newsCount: 5 });
        return result.news || [];
    } catch (error) {
        console.error(`Yahoo News Error for ${symbol}:`, error.message);
        return [];
    }
};

exports.getGeneralNews = async () => {
    try {
        // 'business' query often returns general financial news
        // Alternatively, we can search for a broad index or just generic term
        const result = await yahooFinance.search('finance', { newsCount: 12 });
        return result.news || [];
    } catch (error) {
        console.error('Yahoo General News Error:', error.message);
        return [];
    }
};

exports.getMarketLeaders = async () => {
    try {
        const symbols = [
            'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'BHARTIARTL.NS', 'ICICIBANK.NS',
            'INFY.NS', 'ITC.NS', 'SBIN.NS', 'HINDUNILVR.NS', 'LICI.NS', 'LT.NS'
        ];

        const quotes = await yahooFinance.quote(symbols);

        // Sort by Market Cap descending
        const sorted = quotes.sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0));

        return sorted.slice(0, 10).map(q => ({
            symbol: q.symbol,
            name: q.shortName || q.longName || q.symbol,
            price: q.regularMarketPrice,
            marketCap: q.marketCap,
            percent: q.regularMarketChangePercent
        }));
    } catch (error) {
        console.error('Get Leaders Error:', error);
        return [];
    }
};

exports.getMovers = async () => {
    try {
        const fetchScreener = async (scrId) => {
            try {
                // Try fetching with validation disabled
                // Note: Even with validateResult: false, it may throw FailedYahooValidationError
                // which contains the result in error.result
                const result = await yahooFinance.screener(
                    { scrIds: scrId, count: 5, region: 'IN', lang: 'en-IN' },
                    { validateResult: false }
                );
                return result.quotes;
            } catch (error) {
                // Check if it's the specific validation error that actually has data
                if (error.name === 'FailedYahooValidationError' && error.result && error.result.quotes) {
                    console.warn(`Yahoo Screener Validation Error for ${scrId} (using partial data)`);
                    return error.result.quotes;
                }
                console.error(`Yahoo Screener Error for ${scrId}:`, error.message);
                return [];
            }
        };

        const [rawGainers, rawLosers] = await Promise.all([
            fetchScreener('day_gainers'),
            fetchScreener('day_losers')
        ]);

        // Helper to format quotes
        const formatQuote = (q) => ({
            symbol: q.symbol,
            name: q.shortName || q.longName || q.displayName || q.symbol,
            price: q.regularMarketPrice,
            change: q.regularMarketChange,
            percent: q.regularMarketChangePercent,
            reason: '' // To be filled by AI
        });

        const gainers = rawGainers.map(formatQuote);
        const losers = rawLosers.map(formatQuote);

        return { gainers, losers };
    } catch (error) {
        console.error('Get Movers Error:', error);
        return { gainers: [], losers: [] };
    }
};
