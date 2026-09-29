import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5002/api',
});

export const getMarketStatus = async () => {
    const response = await API.get('/stocks/market/status');
    return response.data;
};

export const searchStocks = async (query: string) => {
    const response = await API.get(`/stocks/search?q=${query}`);
    return response.data;
};

export const getStockQuote = async (symbol: string) => {
    const response = await API.get(`/stocks/quote/${symbol}`);
    return response.data;
};

export const getStockHistory = async (symbol: string, range: string = '1mo') => {
    const response = await API.get(`/stocks/history/${symbol}?range=${range}`);
    return response.data;
};

export const getTrendingStocks = async () => {
    const response = await API.get('/stocks/trending');
    return response.data;
};

export const getMovers = async () => {
    const response = await API.get('/stocks/movers');
    return response.data;
};

export const getStockNews = async (symbol: string) => {
    const response = await API.get(`/stocks/news/${symbol}`);
    return response.data;
};

export const getGeneralNews = async () => {
    const response = await API.get('/stocks/news/general');
    return response.data;
};

export const chatWithAI = async (message: string, history: any[]) => {
    const response = await API.post('/ai/chat', { message, history });
    return response.data;
};

export const analyzeStockNews = async (symbol: string) => {
    const response = await API.get(`/stocks/analyze-news/${symbol}`);
    return response.data;
};

export const getMarketLeaders = async () => {
    const response = await API.get('/stocks/leaders');
    return response.data;
};
