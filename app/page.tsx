'use client';

import { useState, useEffect, useCallback } from 'react';
import { PlusIcon, ArrowPathIcon, TrashIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import StockChart from './components/StockChart';

interface StockData {
  symbol: string;
  price: number;
  currency: string;
  shortName: string;
  regularMarketChange: number;
  regularMarketChangePercent: number;
}

export default function StockTracker() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedStocks, setExpandedStocks] = useState<string[]>([]);

  const fetchStockData = useCallback(async (targetSymbols: string[]) => {
    if (targetSymbols.length === 0) {
      setStocks([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols: targetSymbols }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch stock data');
      }

      setStocks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle adding a new symbol
  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    const ticker = inputValue.trim().toUpperCase();

    if (!ticker) return;
    if (symbols.includes(ticker)) {
      setError('Stock already added');
      return;
    }
    if (symbols.length >= 10) {
      setError('Maximum limit of 10 stocks reached');
      return;
    }

    const newSymbols = [...symbols, ticker];
    setSymbols(newSymbols);
    setInputValue('');
    await fetchStockData(newSymbols);
  };

  // Handle removing a symbol
  const handleRemoveStock = (symbolToRemove: string) => {
    const newSymbols = symbols.filter(s => s !== symbolToRemove);
    setSymbols(newSymbols);
    setStocks(stocks.filter(s => s.symbol !== symbolToRemove));
    setExpandedStocks(prev => prev.filter(s => s !== symbolToRemove));
  };

  // Handle manual refresh
  const handleRefresh = () => {
    fetchStockData(symbols);
  };

  const toggleChart = (symbol: string) => {
    setExpandedStocks(prev => 
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Stock <span className="text-blue-600">Tracker</span>
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Monitor up to 10 of your favorite stocks in real-time.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <form onSubmit={handleAddStock} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter stock symbol (e.g. AAPL, BTC-USD)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Stock
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading || symbols.length === 0}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowPathIcon className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <span>{symbols.length} / 10 stocks tracked</span>
            {isLoading && <span>Updating prices...</span>}
          </div>
        </div>

        {/* Stock Display Grid */}
        {stocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {stocks.map((stock) => {
              const isExpanded = expandedStocks.includes(stock.symbol);
              return (
                <div key={stock.symbol} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{stock.symbol}</h3>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">{stock.shortName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleChart(stock.symbol)}
                        className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}
                        title="View Chart"
                      >
                        <ChartBarIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRemoveStock(stock.symbol)}
                        className="text-gray-400 hover:bg-red-50 hover:text-red-600 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove Stock"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-baseline justify-between">
                    <div className="text-3xl font-bold text-gray-900">
                      {stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-sm font-medium text-gray-400 ml-1">{stock.currency}</span>
                    </div>
                    
                    <div className={`flex items-center text-sm font-semibold ${stock.regularMarketChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.regularMarketChange >= 0 ? (
                        <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                      )}
                      <span>
                        {Math.abs(stock.regularMarketChange).toFixed(2)} ({stock.regularMarketChangePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>

                  {/* Expandable Chart Section */}
                  {isExpanded && (
                    <StockChart symbol={stock.symbol} />
                  )}
                </div>
              );
            })}
          </div>
        ) : !isLoading && symbols.length > 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">No data found for added stocks.</p>
          </div>
        ) : symbols.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 italic">Add a stock symbol above to start tracking prices.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
