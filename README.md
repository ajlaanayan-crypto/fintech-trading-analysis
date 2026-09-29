# 🚀 Fintech Trading Analysis Platform

A Next-Gen, AI-powered stock market dashboard that combines real-time financial data with immersive 3D visuals and generative AI insights.

---

## 🛠️ Technology Stack

### **Frontend (The Visual Layer)**
Built for speed, interactivity, and visual impact.
- **Framework**: [Next.js 16](https://nextjs.org/) (React 19) - Server Side Rendering & Client interactivity.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Modern utility-first styling with comprehensive Dark Mode support.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Complex layout transitions and 3D tilt effects.
- **3D Graphics**: [Three.js](https://threejs.org/) & [Vanta.js](https://www.vantajs.com/) - Interactive "Net" background on the landing page.
- **Charting**: [Chart.js](https://www.chartjs.org/) & `react-chartjs-2` - Financial rendering (Candlestick, OHLC Bars, Area, Pie).
- **Icons**: [Lucide React](https://lucide.dev/) - Clean SVG icons.
- **Theme**: `next-themes` - Seamless light/dark mode switching.

### **Backend (The Engine)**
Built to aggregate data and run AI analysis.
- **Runtime**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/).
- **Financial Data**: `yahoo-finance2` API - Fetches real-time quotes, historical data, and news.
- **Artificial Intelligence**: **Google Gemini 1.5 Flash** - Analyzes news sentiment and explains market movements in natural language.
- **Caching**: In-memory caching strategy to prevent AI rate-limits.

---

## 🏗️ Architecture & Component Flow

### **1. Data Flow Pipeline**
1.  **User Interaction**: User visits `/dashboard/stocks/RELIANCE`.
2.  **Frontend Request**: `page.tsx` calls `lib/api.ts` -> `getStockQuote('RELIANCE.NS')`.
3.  **API Proxy**: Request hits Backend (`localhost:5000/api/stocks/quote/RELIANCE.NS`).
4.  **Data Fetching**:
    *   **Price**: `yahooFinanceService.js` fetches live data from Yahoo.
    *   **News**: Backend fetches latest headlines.
    *   **AI Insight**: If news is present, `geminiService.js` constructs a prompt and asks Gemini to summarize the sentiment (Bullish/Bearish).
5.  **Response**: JSON data is sent back to Frontend.
6.  **Rendering**: `StockChart` renders the graph, `StockNews` displays the AI card.

### **2. Key Components**
*   **`Navbar.tsx`**: Responsive navigation. handles Dark Mode toggling using Tailwind classes.
*   **`MarketLeaderboard.tsx`**: Visualizes Top 10 Indian Companies. Uses a Pie Chart linked to a hoverable list.
*   **`StockChart.tsx`**: A polymorphic chart component. Can switch between `Line`, `Area`, `Candle`, and `Bar` modes. Enforces a 2:1 aspect ratio for readability.
*   **`StockNews.tsx`**: Displays news cards with Framer Motion 3D tilt effects.

---

## 🎨 UI/UX Design Philosophy

*   **Glassmorphism**: We use semi-transparent backgrounds (`bg-white/50 backdrop-blur-md`) to create depth, making content float above the dynamic background.
*   **Immersive Motion**:
    *   **Landing Page**: Features a Vanta.js "Net" effect that reacts to mouse movement.
    *   **Ticker**: An infinite scrolling marquee with glowing indicators (Green=Profit, Red=Loss).
*   **Micro-Interactions**: Hovering over cards causes them to lift and tilt in 3D space.
*   **Data Density**: The layout mimics professional terminals (Google Finance / Bloomberg) with a "Chart Left, Information Right" grid.

---

## 💻 How to Run Locally

### **Prerequisites**
- Node.js installed (v18+ recommended).
- A Google Gemini API Key (for AI features).

### **1. Backend Setup**
The backend runs on Port `5000`.

1.  Navigate to the backend folder:
    ```bash
    cd backend
    
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment:
    Create a `.env` file in the `backend` folder:
    ```env
    PORT=5000
    GEMINI_API_KEY=your_actual_api_key_here
    ```
4.  Start the server:
    ```bash
    node index.js
    ```
    *You should see: `Server running on port 5000`*

### **2. Frontend Setup**
The frontend runs on Port `3000`.

1.  Open a new terminal and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and visit: `http://localhost:3000`

---

## 🌟 Features to Try
1.  **Interactive Landing**: Move your mouse to warp the 3D background network.
2.  **Global News**: Click "News" in the navbar to see the latest top financial stories.
3.  **AI Analysis**: Search for a stock (e.g., `TCS.NS`), look at the "News & AI Analysis" section to see Gemini's take on the market sentiment.
4.  **Chart Switching**: Toggle between "Candle" and "Line" views to analyze price action.

---
