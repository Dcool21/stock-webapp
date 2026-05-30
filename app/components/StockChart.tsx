'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

interface StockChartProps {
  symbol: string;
}

interface ChartDataPoint {
  date: string;
  price: number;
}

const RANGES = ['1d', '1w', '1m', '3m', '1y', '3y', '5y', 'max'];

export default function StockChart({ symbol }: StockChartProps) {
  const [activeRange, setActiveRange] = useState('1m');
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchChartData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/chart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol, range: activeRange }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || result.error || 'Failed to fetch chart data');
        }

        if (isMounted) {
          setData(result.data || []);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchChartData();

    return () => {
      isMounted = false;
    };
  }, [symbol, activeRange]);

  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      if (activeRange === '1d') return format(date, 'HH:mm');
      if (['1w', '1m', '3m'].includes(activeRange)) return format(date, 'MMM d');
      return format(date, 'MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
          <p className="text-gray-500 text-sm mb-1">{formatDate(label)}</p>
          <p className="font-bold text-gray-900">
            ${Number(payload[0].value).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate if trend is positive to determine color
  const isPositive = data.length >= 2 && data[data.length - 1].price >= data[0].price;
  const strokeColor = isPositive ? '#16a34a' : '#dc2626';
  const fillColor = isPositive ? '#dcfce7' : '#fee2e2';

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      {/* Range Selectors */}
      <div className="flex flex-wrap gap-2 mb-6">
        {RANGES.map((range) => (
          <button
            key={range}
            onClick={() => setActiveRange(range)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeRange === range
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {range.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Chart Area */}
      <div className="h-64 w-full relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-red-500 text-center px-4">
            {error}
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`colorPrice-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={fillColor} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={fillColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                minTickGap={30}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                hide 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={strokeColor} 
                strokeWidth={2}
                fillOpacity={1} 
                fill={`url(#colorPrice-${symbol})`} 
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : !isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
            No chart data available
          </div>
        ) : null}
      </div>
    </div>
  );
}
