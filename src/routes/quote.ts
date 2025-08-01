import { Hono } from 'hono';
import { QuoteData } from '../types';

const quote = new Hono();

// GET /quote/ticker/:symbol
quote.get('/ticker/:symbol', async (c) => {
  try {
    const symbolsParam = c.req.param('symbol');
    if (!symbolsParam) {
      return c.json({ error: 'Symbol is required' }, 400);
    }

    const symbols = symbolsParam.split(',').map((s) => s.trim().toUpperCase());
    
    // TODO: Implement actual stock data fetching
    // For now, return mock data
    const mockData = {
      symbol: symbols[0],
      price: 150.25,
      change: 2.50,
      changePercent: 1.69,
      volume: 1000000,
      marketCap: 2500000000,
      timestamp: new Date().toISOString()
    };
    
    return c.json(mockData);
  } catch (error: unknown) {
    console.error('Error fetching quote:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch quote';
    return c.json({ error: errorMessage }, 500);
  }
});

// GET /quote/history/:symbol
quote.get('/history/:symbol', async (c) => {
  try {
    const symbol = c.req.param('symbol');
    const startDate = c.req.query('start');
    const endDate = c.req.query('end');
    let interval = c.req.query('interval') || '1d';

    if (!symbol) {
      return c.json({ error: 'Symbol is required' }, 400);
    }

    if (!startDate || isNaN(Date.parse(startDate))) {
      return c.json({ error: 'Invalid or missing start date' }, 400);
    }

    if (endDate && isNaN(Date.parse(endDate))) {
      return c.json({ error: 'Invalid end date' }, 400);
    }

    const allowedIntervals = ['1d', '1wk', '1mo', '5m', '15m', '30m', '1h'] as const;
    if (!allowedIntervals.includes(interval as typeof allowedIntervals[number])) {
      interval = '1d';
    }

    // TODO: Implement actual historical data fetching
    // For now, return mock data
    const mockData: QuoteData[] = [
      {
        time: Date.now() / 1000,
        open: 150.00,
        high: 152.50,
        low: 149.75,
        close: 151.25,
        volume: 1000000
      },
      {
        time: (Date.now() - 86400000) / 1000,
        open: 149.50,
        high: 151.00,
        low: 148.25,
        close: 150.00,
        volume: 950000
      }
    ];

    return c.json(mockData);
  } catch (error: unknown) {
    console.error('Error fetching history:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch history';
    return c.json({ error: errorMessage }, 500);
  }
});

export default quote; 