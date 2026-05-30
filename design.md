# Stock Tracker Web App Plan

## Objective
Build a web application that allows users to input up to 10 stock codes (tickers) and display their current price per share, including a manual refresh feature.

## Technology Stack
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **Data Provider:** Yahoo Finance (via `yahoo-finance2` npm package)
- **Language:** TypeScript

## Scope & Constraints
- Maximum of 10 stock tickers tracked simultaneously.
- Free-tier friendly data fetching using Yahoo Finance without requiring an explicit API key.
- A seamless full-stack architecture where Next.js API routes act as the middleman between the client and the Yahoo Finance API to avoid CORS issues.

## Implementation Steps

### Phase 1: Setup & Initialization
1. Initialize a new Next.js project with Tailwind CSS and TypeScript in `C:\AIproject\stockWebapp`.
2. Save a copy of this design and planning document to `C:\AIproject\stockWebapp\design.md`.
3. Install the `yahoo-finance2` package for retrieving stock data.
4. Clean up the default Next.js boilerplate code to start fresh.

### Phase 2: Backend API Route
1. Create a Next.js API route (e.g., `app/api/stocks/route.ts`).
2. Implement a `POST` or `GET` handler that accepts an array of stock tickers.
3. Use `yahoo-finance2` (`yahooFinance.quote`) to fetch the current price (`regularMarketPrice`) for each provided ticker.
4. Implement error handling to gracefully handle invalid tickers or API timeouts.

### Phase 3: Frontend Interface
1. **State Management:** Set up React state for the list of added tickers, their corresponding price data, loading states, and error messages.
2. **Input Section:** 
   - A text input field for the user to type a stock ticker (e.g., AAPL, MSFT).
   - An "Add" button that validates the input (preventing duplicates and enforcing the 10-stock limit).
3. **Display Section:**
   - A responsive grid or list displaying each added stock's symbol, current price, and a "Remove" button.
4. **Refresh Mechanism:**
   - A global "Refresh Prices" button that triggers a re-fetch of the API for all currently tracked stocks and updates the UI.

### Phase 4: Validation & Testing
1. Test adding up to the 10-stock limit (verify the 11th is rejected).
2. Test adding valid and invalid ticker symbols.
3. Verify the manual "Refresh Prices" button updates the stock data.
4. Ensure the UI is responsive and looks clean using Tailwind CSS classes.

### Phase 5: Interactive Stock Price Charts
1. **Backend Route:** Create `app/api/chart/route.ts` to fetch historical data via `yahooFinance.chart()`. Support time ranges: 1d, 1w, 1m, 3m, 1y, 3y, 5y, max.
2. **Frontend Dependencies:** Install `recharts`.
3. **UI Integration:** Implement an "Expandable Card" approach where clicking a "View Chart" button on a stock card expands it to reveal a new `StockChart` component.
4. **Time Selectors:** Add controls to switch the time range dynamically for the chart.
5. **Documentation:** Update `C:\AIproject\stock-webapp\design.md` to include these new feature specifications.