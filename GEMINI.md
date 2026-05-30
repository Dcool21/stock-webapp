# Stock Tracker Web App (`stock-webapp`)

This is a Next.js application that allows users to monitor real-time stock prices and view historical performance charts for up to 10 stock symbols.

## Tech Stack
- **Frontend:** Next.js (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, Heroicons
- **Charts:** Recharts
- **Data Source:** Yahoo Finance API (via `yahoo-finance2`)

## Architecture
- **API Proxying:** The client communicates with local API routes (`/api/stocks`, `/api/chart`) to fetch data. This bypasses CORS issues and keeps any future API keys (if added) secure.
- **State Management:** Uses React `useState` and `useCallback` for local dashboard state (symbols, stock data, loading states).

## Building and Running
- **Development:** `npm run dev` (Runs the dev server on `http://localhost:3000`)
- **Build:** `npm run build`
- **Start:** `npm run start`
- **Lint:** `npm run lint`

## Development Conventions
- **Function Documentation:** Every function must include a one-line comment explaining its purpose (as per the root `GEMINI.md`).
- **Type Safety:** Use TypeScript interfaces for all API responses and component props.
- **Tailwind CSS:** Prefer utility classes for styling. Use the `group` class for hover-based visibility (e.g., the delete button on stock cards).
- **Icons:** Use `@heroicons/react/24/outline` for consistency.

## Key Files
- `app/page.tsx`: The main dashboard and entry point.
- `app/api/stocks/route.ts`: Fetches current price data for multiple symbols.
- `app/api/chart/route.ts`: Fetches historical data for the charts.
- `app/components/StockChart.tsx`: Renders historical data using Recharts.
- `design.md`: The original project plan and feature roadmap.

## Usage
Add a stock symbol (e.g., "AAPL", "TSLA", "BTC-USD") using the input field. Click the "Refresh" button to update prices. Click the chart icon on a stock card to view historical data.
