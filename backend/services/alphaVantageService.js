const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'https://www.alphavantage.co/query';
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

const fetchStockData = async (functionName, symbol, additionalParams = {}) => {
    try {
        const params = {
            function: functionName,
            symbol: symbol,
            apikey: API_KEY, // Often 'demo' works for testing if no key provided
            ...additionalParams
        };

        // For Indian stocks, AlphaVantage often uses .BSE or .NSE suffix
        // We will ensure the symbol is passed correctly from the frontend/route

        const response = await axios.get(BASE_URL, { params });
        if (response.data['Note'] || response.data['Information']) {
            console.warn(`AlphaVantage API Warning for ${symbol}:`, response.data);
        }
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from AlphaVantage for ${symbol}:`, error.message);
        throw error;
    }
};

exports.searchStocks = async (query) => {
    return await fetchStockData('SYMBOL_SEARCH', null, { keywords: query });
};

exports.getGlobalQuote = async (symbol) => {
    return await fetchStockData('GLOBAL_QUOTE', symbol);
};

exports.getDailyHistory = async (symbol) => {
    return await fetchStockData('TIME_SERIES_DAILY', symbol);
};
