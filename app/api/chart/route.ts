import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symbol, range } = body;

    if (!symbol || typeof symbol !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid symbol' }, { status: 400 });
    }

    // Determine period1 and interval based on range
    const now = new Date();
    let period1 = new Date();
    let interval: '1m' | '5m' | '15m' | '1h' | '1d' | '1wk' | '1mo' = '1d';

    switch (range) {
      case '1d':
        period1.setDate(now.getDate() - 1);
        interval = '5m';
        break;
      case '1w':
        period1.setDate(now.getDate() - 7);
        interval = '1h';
        break;
      case '1m':
        period1.setMonth(now.getMonth() - 1);
        interval = '1d';
        break;
      case '3m':
        period1.setMonth(now.getMonth() - 3);
        interval = '1d';
        break;
      case '1y':
        period1.setFullYear(now.getFullYear() - 1);
        interval = '1d';
        break;
      case '3y':
        period1.setFullYear(now.getFullYear() - 3);
        interval = '1wk';
        break;
      case '5y':
        period1.setFullYear(now.getFullYear() - 5);
        interval = '1wk';
        break;
      case 'max':
        period1 = new Date('1970-01-01');
        interval = '1mo';
        break;
      default:
        // Default to 1 month
        period1.setMonth(now.getMonth() - 1);
        interval = '1d';
        break;
    }

    // Use yahooFinance.chart to fetch historical data
    const result = await yahooFinance.chart(symbol, {
      period1: period1,
      interval: interval,
    });

    if (!result || !result.quotes || result.quotes.length === 0) {
      return NextResponse.json({ error: 'No data found for the given range' }, { status: 404 });
    }

    // Format data for recharts
    const chartData = result.quotes.map((q: any) => ({
      date: q.date ? q.date.toISOString() : null,
      price: q.close !== null ? q.close : undefined,
    })).filter((q: any) => q.price !== undefined && q.date !== null);

    return NextResponse.json({ symbol, range, data: chartData });
  } catch (error: any) {
    console.error('Yahoo Finance Chart API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch chart data', 
      message: error.message 
    }, { status: 500 });
  }
}
