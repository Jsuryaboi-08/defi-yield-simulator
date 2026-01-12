# Project Explanation: DeFi Yield Simulator

This document provides a technical overview of the DeFi Yield Simulator project, explaining the technology stack, project structure, and the logic behind the yield calculations.

## 1. Tech Stack

The project is a Single Page Application (SPA) built with modern web technologies:

*   **Frontend Framework**: [React](https://react.dev/) (v19) - Used for building the user interface and managing application state.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4) - A utility-first CSS framework for rapid UI development.
*   **Icons**: [Lucide React](https://lucide.dev/) - A library of beautiful, consistent icons.
*   **Charting**: [Recharts](https://recharts.org/) - A composable charting library built on React components, used for the growth projection graph.
*   **Data Fetching**: Native browser `fetch` API - Used to retrieve live cryptocurrency prices.
*   **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/) - For unit and component testing.

## 2. Project Structure

*   **`src/App.js`**: This is the core file containing the entire application logic. It handles:
    *   State management (investment amount, timeframe, selected protocol, etc.).
    *   Yield calculations.
    *   API calls to CoinGecko.
    *   UI rendering (Controls, Charts, Summary).
*   **`src/index.js`**: The entry point that renders the `App` component into the DOM.
*   **`public/`**: Contains static assets like `index.html` and the manifest.
*   **`Streamlit Deployment/`**: An existing directory structure that is currently empty/unused in the React application context.

## 3. How It Works

### Application Flow
1.  **Initialization**: When the app loads, it initializes state with default values (Uniswap, $10,000 investment, 12 months).
2.  **Data Fetching**: A `useEffect` hook triggers `fetchPrices()` to get real-time Ethereum (ETH) and DAI prices from the CoinGecko API.
3.  **User Interaction**: Users can adjust:
    *   **Protocol**: Selects a DeFi protocol (Uniswap, Aave, MakerDAO, Yearn).
    *   **Investment**: Slider to set initial principal ($100 - $100,000).
    *   **Timeframe**: Slider to set duration (1 - 60 months).
    *   **Compounding**: Dropdown to select frequency (Daily, Weekly, Monthly, Yearly).
4.  **Real-time Calculation**: Any change in inputs triggers the `calculateYield()` function via a `useEffect` hook, updating the chart and summary statistics immediately.

### Calculation Logic

The simulator uses the **Compound Interest Formula** to project future value.

**Formula**:
$$A = P \left(1 + \frac{r}{n}\right)^{nt}$$

**Where**:
*   $A$ = Future Value (`currentValue`)
*   $P$ = Principal Investment (`investment`)
*   $r$ = Annual Interest Rate (APY) (`apy`)
*   $n$ = Number of times interest applied per time period (`compoundFrequency`)
*   $t$ = Number of time periods elapsed (`periodsElapsed` in years)

**Implementation Details**:
*   **APY Rates**: Hardcoded base rates for demonstration:
    *   Uniswap: 15%
    *   Yearn: 8%
    *   MakerDAO: 5%
    *   Aave: 3.5%
*   **Compounding Frequencies**:
    *   Daily: $n = 365$
    *   Weekly: $n = 52$
    *   Monthly: $n = 12$
    *   Yearly: $n = 1$
*   **Projection Loop**: The code iterates through each month from 0 to `timeframe`. For each month:
    1.  Calculates `periodsElapsed` in years: `(month / 12) * compoundFrequency`.
    2.  Applies the compound interest formula.
    3.  Stores the result for the chart data.

### API Integration
*   **Endpoint**: `https://api.coingecko.com/api/v3/simple/price`
*   **Parameters**: `ids=ethereum,dai` & `vs_currencies=usd`
*   **Usage**: Displays the current market price of ETH and DAI to provide context, though these prices do not directly affect the yield simulation math in this version.
