<p align="center">
  <h1 align="center">📈 QuantView — StockTrend AI</h1>
  <p align="center">
    <em>Algorithmic Market Analysis & Predictive Intelligence Platform</em>
  </p>
  <p align="center">
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"></a>
    <a href="https://spring.io"><img src="https://img.shields.io/badge/Spring_Boot_3.4-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot"></a>
    <a href="https://python.org"><img src="https://img.shields.io/badge/Python_3.10+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"></a>
    <a href="https://xgboost.ai"><img src="https://img.shields.io/badge/XGBoost-FF6600?style=flat-square&logo=xgboost&logoColor=white" alt="XGBoost"></a>
    <a href="https://pytorch.org"><img src="https://img.shields.io/badge/LSTM_(PyTorch)-EE4C2C?style=flat-square&logo=pytorch&logoColor=white" alt="PyTorch"></a>
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License">
  </p>
  <p align="center">
    <a href="#-features">Features</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-the-ml-pipeline">ML Pipeline</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-api-reference">API Reference</a>
  </p>
</p>

---

## 🧠 What is QuantView?

**QuantView** is a full-stack financial research platform that bridges the gap between retail trading and quantitative analysis. Unlike standard brokerage platforms that simply execute trades, QuantView serves as a **Decision Support System (DSS)** — it fetches real market data, runs it through an **XGBoost + LSTM ensemble** machine learning pipeline, and delivers transparent, data-driven predictions.

> *"Every trade has two participants — one uses intuition, the other uses math.*
> *QuantView was built for the second one."*

### The Problem

| Limitation | Traditional Platforms | QuantView |
|---|---|---|
| **Data Output** | Historical charts (past) | Predictive trend lines (future) |
| **User Logic** | "Black Box" (hidden algorithms) | "White Box" (visible metrics & feature importances) |
| **Primary Function** | Order execution | Data computation & trend analysis |
| **Model Insight** | None | MSE, MAE, R² Score, feature importance bars |

---

## ✨ Features

- **🔮 Predictive Analytics** — Real-time forecasting using an XGBoost + LSTM ensemble model with 13 engineered features. Projects the **next-day closing price (T+1)** from 2 years of historical data.
- **📊 Interactive Dashboard** — High-fidelity charts with Recharts overlaying predicted trends onto actual historical prices. KPI cards show Current Price, T+1 Prediction, R² Score, and MSE at a glance.
- **🔬 Algorithmic Transparency** — "White Box" approach displaying MSE, MAE, R² Score, and feature importances so users can judge model reliability.
- **📈 Live Market Data** — Real-time stock quotes via Server-Sent Events (SSE) with background polling from Yahoo Finance. Top gainers, losers, and volume leaders update continuously.
- **📉 Technical Indicators** — SMA-20, SMA-50, SMA-200, EMA-20, RSI-14, MACD, Bollinger Bands computed automatically on every fetch.
- **🌍 Multi-Market Universe** — Tracks 60+ tickers across US equities (NYSE/NASDAQ), Indian markets (NSE/BSE), and crypto (BTC, ETH, SOL, BNB, XRP).
- **⭐ Watchlist & Persistence** — Save frequently tracked stocks with full CRUD operations, backed by H2 (dev) or MySQL (prod) database.
- **🌗 Premium Theming** — Dark/light mode with smooth pill-shaped toggle, CSS theme transitions, and custom animated cursor.
- **🔐 Authentication** — Secure user management with Clerk (optional — app works fully without it).
- **📱 Responsive Layout** — Collapsible sidebar navigation, mobile-optimized views, and smooth scroll with Lenis.

---

## 🏗️ Architecture

QuantView follows a **three-tier distributed architecture** — three services, three languages, one pipeline:

```
         YOU
          │
          │  search "AAPL"
          ▼
    ┌───────────┐         ┌───────────┐         ┌───────────┐
    │           │  REST   │           │  REST   │           │
    │  REACT    │ ──────► │  SPRING   │ ──────► │  PYTHON   │
    │  :5173    │ ◄────── │  :8080    │ ◄────── │  :5000    │
    │           │  JSON   │           │  JSON   │           │
    └───────────┘         └─────┬─────┘         └─────┬─────┘
     TypeScript             Java │                 ML  │
     Tailwind               JPA  │              XGBoost│
     Recharts              Cache │                LSTM │
                                 │                     │
                           ┌─────▼─────┐         ┌────▼──────┐
                           │  H2 / SQL  │         │  YAHOO    │
                           │  Database  │         │  FINANCE  │
                           └───────────┘         └───────────┘
```

### The Request Lifecycle

```
 1.  User types "AAPL" ──────────────────────────────────────► SearchBar.tsx
 2.  React calls GET /api/predict/AAPL ──────────────────────► api.ts
 3.  Spring Boot validates ticker format ────────────────────► StockService.java
 4.  Checks prediction cache (15-min TTL) ──────────────────► PredictionCacheRepository
 5.  Cache miss → forwards to Python ────────────────────────► RestTemplate → :5000
 6.  Python downloads 2 years of OHLCV from Yahoo Finance ──► data_fetcher.py
 7.  Engineers 13 technical features (SMA, RSI, MACD, etc.) ► data_fetcher.py
 8.  Trains XGBoost (200 trees, depth 6, lr 0.05) ─────────► model.py
 9.  Trains LSTM (64 units, 150 epochs, 10-step windows) ──► model.py
10.  Blends predictions: 60% XGBoost + 40% LSTM ───────────► model.py
11.  Returns JSON with prediction, metrics, importances ────► app.py
12.  Spring Boot caches result → sends ApiResponse<T> ──────► PredictionController.java
13.  React renders chart + KPIs + feature importance bars ──► Dashboard.tsx
```

_Total time: ~3–8 seconds for a cold request. Instant on cache hit._

### Connection Map

| From | To | Protocol | Route |
|---|---|---|---|
| React `:5173` | Spring Boot `:8080` | HTTP REST | `/api/stock/{ticker}`, `/api/predict/{ticker}` |
| React `:5173` | Spring Boot `:8080` | SSE | `/api/market/stream`, `/api/market/stream/{symbol}` |
| Spring Boot `:8080` | Python `:5000` | HTTP REST | `/predict?ticker=X`, `/stock?ticker=X` |
| Python `:5000` | Spring Boot `:8080` | HTTP POST | `/api/market/internal/ingest` (poller pushback) |
| Python `:5000` | Yahoo Finance | HTTP | `yfinance` library |

---

## 🧪 The ML Pipeline

### Why an Ensemble?

Markets are complex. No single model captures everything.

| | XGBoost | LSTM | Ensemble |
|---|---|---|---|
| **Learns** | Feature correlations | Time sequences | Both |
| **Example** | "RSI < 30 → oversold" | "3 red days → bounce" | All patterns |
| **Speed** | ⚡ Fast | 🐢 Slower | ⚡ Cached |
| **Weight** | 60% | 40% | — |

### Ensemble Architecture

```
                    ┌─────────────────────┐
                    │   Raw OHLCV Data    │
                    │   (2 years daily)   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Feature Engineering │
                    │   13 features from   │
                    │   data_fetcher.py    │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │    XGBoost       │        │      LSTM        │
        │  (60% weight)    │        │   (40% weight)   │
        │                  │        │                  │
        │ • 200 estimators │        │ • 10-step window │
        │ • max_depth=6    │        │ • 64 hidden units│
        │ • lr=0.05        │        │ • 150 epochs     │
        │ • subsample=0.8  │        │ • Adam optimizer │
        └────────┬────────┘        └────────┬────────┘
                 │                           │
                 └─────────────┬─────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Ensemble Prediction │
                    │  0.6×XGB + 0.4×LSTM │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Metrics + Response  │
                    │  MSE, MAE, R², T+1   │
                    └─────────────────────┘
```

### Feature Engineering (13 Features from OHLCV)

Raw price data is useless. The model needs _derived signals_:

```python
# Trend Indicators
sma_50          # 50-day moving average     — medium-term direction
sma_200         # 200-day moving average    — long-term direction

# Momentum
rsi_14          # Relative Strength Index   — overbought vs oversold
macd            # MACD line                 — momentum direction
macd_signal     # MACD signal line          — crossover triggers

# Volatility
bb_upper        # Bollinger upper band      — price ceiling
bb_lower        # Bollinger lower band      — price floor

# Price Action
daily_return    # % change from yesterday   — immediate momentum
volume_change   # Volume % change           — conviction behind moves

# Memory (Autoregressive Lags)
lag_1           # Price 1 day ago           — strongest predictor
lag_2           # Price 2 days ago
lag_3           # Price 3 days ago
lag_5           # Price 5 days ago          — weekly lookback
```

### Training & Evaluation

```
|◄────────── Training Set ──────────►|◄── Test (30 days) ──►|
|         (all data minus 30 days)    |   (walk-forward)     |
```

Metrics (MSE, MAE, R²) are computed on the **test set only** — the model never sees these 30 days during training. This prevents data leakage.

### Sample Prediction Response

```json
{
  "ticker": "AAPL",
  "currentPrice": 198.52,
  "predictedPrice": 201.34,
  "priceChange": 2.82,
  "priceChangePercent": 1.42,
  "mse": 3.1247,
  "mae": 1.4523,
  "r2Score": 0.9734,
  "modelUsed": "XGBoost + LSTM (0.6/0.4 Ensemble)",
  "feature_importances": {
    "lag_1": 0.4521,
    "sma_50": 0.1234,
    "rsi_14": 0.0892
  },
  "historicalData": ["..."],
  "predicted_prices": ["..."],
  "dataPoints": 480,
  "trainingSize": 450
}
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite 8 | UI framework & build tool |
| **Styling** | Tailwind CSS 3, shadcn/ui (50+ Radix primitives) | Design system |
| **Charts** | Recharts | Financial data visualization |
| **Animation** | Framer Motion, GSAP, Lenis | Smooth UI transitions & scroll |
| **Auth** | Clerk (optional) | User authentication |
| **State** | TanStack Query v5 | Server state & cache management |
| **Routing** | React Router v6 | Client-side navigation |
| **Backend** | Java 17, Spring Boot 3.4 | REST API orchestration |
| **ORM** | Spring Data JPA, Lombok | Data access & boilerplate reduction |
| **Streaming** | SSE (SseEmitter) | Live market data push |
| **ML Engine** | Python 3.10+, Flask 3.1 | ML microservice |
| **ML Models** | XGBoost 2.1, PyTorch (LSTM) | Gradient boosting + deep learning ensemble |
| **ML Tools** | Scikit-learn 1.6, Pandas 2.2, NumPy 2.2 | Data processing & metrics |
| **Data** | yfinance | Historical + snapshot market data |
| **Database** | H2 (dev) / MySQL 8 (prod) | Watchlists & prediction cache |
| **Testing** | Vitest, pytest | Frontend & ML testing |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Check Command |
|---|---|---|
| **Node.js** | 18+ | `node --version` |
| **Java JDK** | 17+ | `java --version` |
| **Python** | 3.10+ | `python3 --version` |

> **⚠️ Start order matters:** Python → Spring Boot → React

### 1. Python ML Engine (start first)

```bash
cd python-engine

# Create & activate virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Start the ML service
python app.py                   # → http://localhost:5000
```

### 2. Spring Boot Backend

```bash
cd backend

# Make wrapper executable (first time only)
chmod +x mvnw

# Build & run
./mvnw spring-boot:run          # → http://localhost:8080
```

### 3. React Frontend

```bash
cd frontend

# Install dependencies
npm install

# (Optional) Configure Clerk authentication
cp .env.example .env
# Edit .env → add VITE_CLERK_PUBLISHABLE_KEY

# Start dev server
npm run dev                     # → http://localhost:5173
```

### 4. Verify the Full Pipeline

```bash
# Test Python ML engine directly
curl "http://localhost:5000/health"
# → {"status": "ok", "service": "quantview-ml-engine"}

# Test through Spring Boot
curl "http://localhost:8080/api/health"
# → {"success": true, "data": {"status": "ok"}, ...}

# Run a full prediction
curl "http://localhost:8080/api/predict/AAPL" | head -c 200

# Open the dashboard → http://localhost:5173
# Search "AAPL" → see chart, KPIs, feature importances
```

### Environment Variables

| Variable | File | Required | Purpose |
|---|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | `frontend/.env` | No | User authentication (app works without it) |
| `VITE_ALPHA_VANTAGE_API_KEY` | `frontend/.env` | No | Additional market data |
| `FINNHUB_API_KEY` | System env | No | Real-time WebSocket (uses polling fallback) |

### Database

**Default: H2 in-memory** — zero setup, data resets on restart.

For **persistent MySQL**:

```properties
# backend/src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/quantview
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=yourpassword
```

Schema file provided at [`database/schema.sql`](database/schema.sql) — includes `watchlist` and `prediction_cache` tables.

---

## 📡 API Reference

### Spring Boot `:8080`

| Verb | Route | Description |
|:---:|---|---|
| `GET` | `/api/stock/{ticker}` | Historical OHLCV data via Python passthrough |
| `GET` | `/api/predict/{ticker}` | Full ML prediction (cached 15 min) |
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/market/stream` | SSE — all live quotes broadcast |
| `GET` | `/api/market/stream/{symbol}` | SSE — single ticker updates |
| `GET` | `/api/market/quotes` | All live quotes snapshot |
| `GET` | `/api/market/quotes/{symbol}` | Single quote lookup |
| `GET` | `/api/market/gainers?limit=10` | Top gainers by % change |
| `GET` | `/api/market/losers?limit=10` | Top losers by % change |
| `GET` | `/api/market/volume?limit=10` | Top by volume |
| `GET` | `/api/market/status` | Exchange open/closed map (NYSE, NSE, CRYPTO) |
| `GET` | `/api/watchlist` | User's saved tickers (header: `X-User-Id`) |
| `POST` | `/api/watchlist` | Add ticker `{"ticker":"AAPL"}` |
| `DELETE` | `/api/watchlist/{ticker}` | Remove ticker |
| `POST` | `/api/market/internal/ingest` | Internal — Python poller pushback |

### Python ML Engine `:5000`

| Verb | Route | Description |
|:---:|---|---|
| `GET` | `/predict?ticker=AAPL` | Train ensemble model + return prediction JSON |
| `GET` | `/stock?ticker=AAPL` | Raw OHLCV data (yfinance passthrough) |
| `GET` | `/health` | ML engine health check |

---

## 📂 Project Structure

```
quantview/
│
├── frontend/                        REACT 18 + TYPESCRIPT + VITE 8
│   ├── src/
│   │   ├── pages/                   Home, Dashboard, Market, About, Login, Settings
│   │   ├── components/
│   │   │   ├── charts/              StockChart, DonutChart
│   │   │   ├── market/              LiveQuoteCard, StockTable, SectorHeatmap,
│   │   │   │                        LivePriceTicker, MarketSummaryBar
│   │   │   ├── layout/              AppSidebar, SearchBar
│   │   │   ├── widgets/             KPICard, ModelDetails, PeerList, TickerStrip
│   │   │   ├── ui/                  50+ shadcn/ui primitives (Button, Card, Dialog…)
│   │   │   ├── CustomCursor/        Animated custom cursor component
│   │   │   └── *.tsx                ThemeToggle, LiveClock, SmoothScroll,
│   │   │                            SmartHeader, UserDropdown, ScrambleText, etc.
│   │   ├── hooks/                   useStock, useMarketStream, useMarketData,
│   │   │                            useWatchlist, useLiveQuote, useTheme, useAuth
│   │   ├── services/api.ts          All REST calls to :8080
│   │   ├── config/
│   │   │   ├── apiConfig.ts         API_BASE_URL (single source of truth)
│   │   │   ├── marketUniverse.ts    60+ tracked symbols across US, IN, crypto
│   │   │   └── clerk.ts             Clerk auth configuration
│   │   ├── types/                   TypeScript interfaces (stock, market, auth)
│   │   ├── lib/                     Utility functions
│   │   └── test/                    Vitest test suite
│   ├── .env.example                 Environment variable template
│   └── package.json
│
├── backend/                         SPRING BOOT 3.4 + JAVA 17
│   └── src/main/java/com/quantview/
│       ├── QuantViewApplication.java   Application entry point
│       ├── controller/
│       │   ├── StockController.java          GET /api/stock/{ticker}
│       │   ├── PredictionController.java     GET /api/predict/{ticker}
│       │   ├── MarketDataController.java     SSE streams + REST quotes
│       │   └── WatchlistController.java      CRUD watchlist endpoints
│       ├── service/
│       │   ├── StockService.java             Cache logic + Python proxy
│       │   ├── MarketDataService.java        Live quote management
│       │   └── WatchlistService.java         Watchlist business logic
│       ├── config/
│       │   ├── CorsConfig.java               Cross-origin for :5173
│       │   ├── CacheConfig.java              Spring cache manager
│       │   └── CacheEvictorConfig.java       Scheduled cache eviction
│       ├── dto/                     ApiResponse<T>, StockPredictionDTO, WatchlistItemDTO
│       ├── model/                   Watchlist, PredictionCache, LiveQuote (JPA entities)
│       ├── repository/             JPA repositories
│       ├── exception/              GlobalExceptionHandler
│       ├── client/                 External API clients
│       └── util/                   MarketHoursUtil (exchange open/close logic)
│
├── python-engine/                   FLASK + XGBOOST + PYTORCH (LSTM)
│   ├── app.py                       Flask routes (/predict, /stock, /health)
│   ├── model.py                     XGBoost + LSTM ensemble pipeline
│   ├── data_fetcher.py              yfinance ingestion + 13 feature engineering
│   ├── batch_quotes.py              Bulk quote fetcher for live market data
│   ├── market_poller.py             Background daemon thread → pushes to Spring Boot
│   ├── test_model.py                pytest ML model tests
│   └── requirements.txt             Python dependencies
│
├── database/
│   └── schema.sql                   MySQL schema (watchlist + prediction_cache)
│
├── TECHNICAL_README.md              In-depth technical documentation
├── SETUP_GUIDE.md                   Step-by-step setup instructions
└── README.md                        ← You are here
```

---

## 🗺️ Roadmap

### ✅ Completed

- [x] React 18 + TypeScript + Vite interactive dashboard
- [x] Tailwind CSS + shadcn/ui design system (50+ primitives)
- [x] 6 pages: Home, Dashboard, Market, About, Login, Settings
- [x] Interactive stock charts with Recharts (actual vs predicted overlays)
- [x] XGBoost + LSTM ensemble ML pipeline with 13 engineered features
- [x] Spring Boot REST API orchestration with prediction caching (15-min TTL)
- [x] Live market data via SSE streaming + Python background poller
- [x] 60+ ticker market universe (US, India, Crypto)
- [x] Watchlist CRUD (frontend ↔ Spring Boot ↔ H2/MySQL)
- [x] Feature importances visualization
- [x] Premium dark/light theming with smooth transitions
- [x] Clerk authentication (optional, graceful fallback)
- [x] Custom animated cursor, smooth scroll (Lenis), micro-animations
- [x] Market status tracking (NYSE, NSE, CRYPTO exchange hours)
- [x] Top gainers, losers, and volume leaders endpoints
- [x] Global error handling with toast notifications (Sonner)
- [x] Responsive sidebar navigation

### 🔲 Planned

- [ ] Temporal Fusion Transformer model
- [ ] Multi-ticker portfolio optimization
- [ ] Docker Compose single-command deploy
- [ ] CI/CD with GitHub Actions
- [ ] User-configurable model parameters
- [ ] Historical prediction accuracy tracking

---

## ❓ FAQ

<details>
<summary><strong>What is QuantView?</strong></summary>
QuantView is a web-based financial research lab. It visualizes historical stock data and generates mathematically derived predictions using an XGBoost + LSTM ensemble model. It is a decision support tool, not a brokerage.
</details>

<details>
<summary><strong>Which markets are supported?</strong></summary>
NYSE, NASDAQ, NSE (India), BSE, and crypto (BTC, ETH, SOL, BNB, XRP). Use suffixes like <code>.NS</code> for NSE stocks (e.g., <code>RELIANCE.NS</code>) and <code>-USD</code> for crypto.
</details>

<details>
<summary><strong>How does the prediction work?</strong></summary>
The system downloads 2 years of daily OHLCV data, engineers 13 technical features (SMA, RSI, MACD, Bollinger Bands, lags), trains an XGBoost model and an LSTM model in parallel, then blends their predictions (60/40 weighted) to project the next-day closing price. The last 30 days are held out for evaluation.
</details>

<details>
<summary><strong>Is the data real-time?</strong></summary>
Yes. A background Python poller fetches live snapshots from Yahoo Finance every 60 seconds and pushes them to Spring Boot via an internal REST endpoint. The frontend receives updates via SSE streams. Historical data may have ~15 minute delay depending on the provider.
</details>

<details>
<summary><strong>Can I trust the predictions?</strong></summary>
Predictions are based on mathematical probability, not certainty. The application displays error metrics (MSE, MAE, R²) and feature importances so you can judge reliability. <strong>This is a research tool, not financial advice.</strong>
</details>

<details>
<summary><strong>Do I need Clerk / API keys to run it?</strong></summary>
No. The app works fully without Clerk — authentication is skipped gracefully. Finnhub and Alpha Vantage keys are also optional; the app falls back to polling / yfinance-only mode.
</details>

<details>
<summary><strong>What if a ticker is not found?</strong></summary>
Double-check the symbol spelling. Use exchange suffixes for non-US stocks (<code>RELIANCE.NS</code> for NSE, <code>BTC-USD</code> for crypto). If the issue persists, the stock may not be listed on Yahoo Finance.
</details>

---

## 📚 References

- Chen & Guestrin (2016). *XGBoost: A Scalable Tree Boosting System.* KDD.
- Hochreiter & Schmidhuber (1997). *Long Short-Term Memory.* Neural Computation.
- Pedregosa, F., et al. (2011). *Scikit-learn: Machine Learning in Python.* JMLR.
- [yfinance](https://pypi.org/project/yfinance/) · [Spring Boot](https://spring.io/projects/spring-boot) · [React](https://react.dev) · [scikit-learn](https://scikit-learn.org) · [PyTorch](https://pytorch.org)

---

## 📄 License

MIT

---

<p align="center">
  <strong>Built with ❤️ by <a href="https://github.com/Kaif89">Kaif</a></strong><br/>
  <em>"In God we trust. All others must bring data."</em> — W. Edwards Deming
</p>
