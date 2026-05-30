import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symbols } = body;

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid symbols' }, { status: 400 });
    }

    if (symbols.length > 10) {
      return NextResponse.json({ error: 'Maximum 10 symbols allowed' }, { status: 400 });
    }

    // yahoo-finance2's quote method can take a string or an array of strings.
    // If it's an array, it returns an array of quotes.
    const results = await yahooFinance.quote(symbols);
    
    // Normalize: yahoo-finance2 returns a single object if only one symbol is requested,
    // or an array if multiple symbols were requested.
    const quotes = Array.isArray(results) ? results : [results];

    const stockData = quotes.map((quote: any) => ({
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
      currency: quote.currency,
      shortName: quote.shortName,
      regularMarketChange: quote.regularMarketChange,
      regularMarketChangePercent: quote.regularMarketChangePercent,
    }));

    return NextResponse.json(stockData);
  } catch (error: any) {
    console.error('Yahoo Finance API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch stock data', 
      message: error.message 
    }, { status: 500 });
  }
}
