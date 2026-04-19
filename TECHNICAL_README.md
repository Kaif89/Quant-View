
<div align="center">

# `Q U A N T V I E W`

### _Where Wall Street Math Meets Open Source_

[![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.4-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io)
[![Python](https://img.shields.io/badge/Python_3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-FF6600?style=flat-square&logo=xgboost&logoColor=white)](https://xgboost.ai)
[![PyTorch](https://img.shields.io/badge/LSTM_(PyTorch)-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)](https://pytorch.org)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br/>

> _"Every trade has two participants — one uses intuition, the other uses math._
> _QuantView was built for the second one."_

<br/>

**[Architecture](#003--architecture)** · **[The Algorithm](#004--the-algorithm)** · **[API Reference](#005--api-endpoints)** · **[Run It](#006--getting-started)**

</div>

---

<br/>

## `001` — THE IDEA

Most trading apps show you _what happened_. QuantView shows you _what's likely to happen next_.

It's not a brokerage. It's not a portfolio tracker. It's a **Financial Research Lab** — a system that downloads real market data, runs it through machine learning models, and tells you:

- 📍 Where the price is **right now**
- 📈 Where it's **likely going** tomorrow (T+1 prediction)
- 🎯 How **confident** the model is (R², MSE, MAE)
- 🔬 **Which features** drove the prediction (feature importances)

_All transparent. No black boxes._

<br/>

## `002` — WHAT YOU GET

```
┌─────────────────────────────────────────────────────┐
│  DASHBOARD                                           │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│  │ PRICE  │ │  T+1   │ │   R²   │ │  MSE   │       │
│  │$198.52 │ │$201.34 │ │ 0.9734 │ │ 3.12   │       │
│  └────────┘ └────────┘ └────────┘ └────────┘       │
│                                                      │
│  ┌──────────────────────┐  ┌──────────────────┐     │
│  │                      │  │  MARKET SIGNALS   │     │
│  │   STOCK CHART        │  │  AAPL  BUY ↑1.2% │     │
│  │   ████ actual        │  │  TSLA  SELL↓2.1% │     │
│  │   ░░░░ predicted     │  │  MSFT  HOLD 0.3% │     │
│  │                      │  │                   │     │
│  └──────────────────────┘  └──────────────────┘     │
│                                                      │
│  ┌──────────────────────┐  ┌──────────────────┐     │
│  │  TECHNICALS          │  │  MODEL INSIGHTS   │     │
│  │  SMA 20  $195.50     │  │  Model: XGB+LSTM  │     │
│  │  SMA 50  $192.30     │  │  R²: 0.9734       │     │
│  │  SMA 200 $180.10     │  │  ▓▓▓▓ lag_1  45%  │     │
│  │                      │  │  ▓▓░░ sma_50 12%  │     │
│  └──────────────────────┘  └──────────────────┘     │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  ⭐ WATCHLIST    AAPL  GOOGL  MSFT  TSLA     │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

<br/>

## `003` — ARCHITECTURE

Three services. Three languages. One pipeline.

```
         YOU
          │
          │  click "AAPL"
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
 3.  Spring Boot checks cache ───────────────────────────────► StockService.java
 4.  Cache miss → forwards to Python ────────────────────────► PredictionController.java
 5.  Python downloads 2 years of OHLCV from Yahoo Finance ──► data_fetcher.py
 6.  Engineers 13 technical features ────────────────────────► data_fetcher.py
 7.  Trains XGBoost (200 trees, depth 6) ───────────────────► model.py
 8.  Trains LSTM (64 units, 150 epochs, 10-step windows) ──► model.py
 9.  Blends predictions: 60% XGBoost + 40% LSTM ───────────► model.py
10.  Returns JSON with prediction, metrics, importances ────► app.py
11.  Spring Boot caches result (5 minutes) ─────────────────► StockService.java
12.  React renders chart + KPIs + feature bars ─────────────► Dashboard.tsx
```

_Total time: ~3-8 seconds for a cold request. Instant on cache hit._

### Connection Map

| From | To | Protocol | Route |
|---|---|---|---|
| React `:5173` | Spring Boot `:8080` | HTTP REST | `/api/stock/{ticker}`, `/api/predict/{ticker}` |
| React `:5173` | Spring Boot `:8080` | SSE | `/api/market/stream` |
| Spring Boot `:8080` | Python `:5000` | HTTP REST | `/predict?ticker=X`, `/stock?ticker=X` |
| Spring Boot `:8080` | Finnhub | WebSocket | `wss://ws.finnhub.io` |
| Python `:5000` | Yahoo Finance | HTTP | `yfinance` library |

<br/>

## `004` — THE ALGORITHM

### Why Not Just One Model?

Because markets are complex. No single model captures everything.

| | XGBoost | LSTM | Ensemble |
|---|---|---|---|
| **Learns** | Feature correlations | Time sequences | Both |
| **Example** | "RSI < 30 → oversold" | "3 red days → bounce" | All patterns |
| **Speed** | ⚡ Fast | 🐢 Slower | ⚡ Cached |
| **Weight** | 60% | 40% | — |

### The Ensemble Pipeline

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

### XGBoost Config

```python
XGBRegressor(
    n_estimators   = 200,       # 200 sequential decision trees
    max_depth      = 6,         # each tree has max 6 levels
    learning_rate  = 0.05,      # slow learning = less overfitting
    subsample      = 0.8,       # each tree sees 80% of data
    colsample_bytree = 0.8,     # each tree sees 80% of features
    objective      = 'reg:squarederror'
)
```

### LSTM Config

```python
SimpleLSTM(
    input_size  = 13,           # 13 features per timestep
    hidden_size = 64,           # 64 memory units
    num_layers  = 1,            # single LSTM layer
    seq_len     = 10,           # looks at 10-day windows
    epochs      = 150,          # training iterations
    optimizer   = Adam(lr=0.01) # adaptive learning rate
)
```

### Training Split

```
|◄────────── Training Set ──────────►|◄── Test (30 days) ──►|
|         (all data minus 30 days)    |   (walk-forward)     |
```

Metrics (MSE, MAE, R²) are computed on the **test set only** — the model never sees these 30 days during training. This prevents data leakage.

### Prediction Response

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
  "historicalData": [...],
  "predicted_prices": [...],
  "dataPoints": 480,
  "trainingSize": 450
}
```

<br/>

## `005` — API ENDPOINTS

### Spring Boot `:8080`

| Verb | Route | What It Does |
|:---:|---|---|
| `GET` | `/api/stock/{ticker}` | Historical OHLCV data (cached 60s) |
| `GET` | `/api/predict/{ticker}` | Full ML prediction (cached 5min) |
| `GET` | `/api/health` | `{"status": "ok"}` |
| `GET` | `/api/market/stream` | SSE live quote stream |
| `GET` | `/api/market/quotes` | All live quotes snapshot |
| `GET` | `/api/market/gainers` | Top gainers by % change |
| `GET` | `/api/market/losers` | Top losers by % change |
| `GET` | `/api/market/status` | Exchange open/closed map |
| `GET` | `/api/watchlist` | User's saved tickers _(header: `X-User-Id`)_ |
| `POST` | `/api/watchlist` | Add ticker `{"ticker":"AAPL"}` |
| `DELETE` | `/api/watchlist/{ticker}` | Remove ticker |

### Python ML Engine `:5000`

| Verb | Route | What It Does |
|:---:|---|---|
| `GET` | `/predict?ticker=AAPL` | Train model + return prediction JSON |
| `GET` | `/stock?ticker=AAPL` | Raw OHLCV data (yfinance passthrough) |
| `GET` | `/health` | ML engine health check |

<br/>

## `006` — GETTING STARTED

### Prerequisites

```
node     >= 18       (frontend)
java     >= 17       (backend)
python   >= 3.10     (ML engine)
```

### Quick Start

```bash
# Terminal 1 — Python ML Engine (start first)
cd python-engine
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python app.py                          # → http://localhost:5000

# Terminal 2 — Spring Boot Backend
cd backend
./mvnw spring-boot:run                 # → http://localhost:8080

# Terminal 3 — React Frontend
cd frontend
npm install
cp .env.example .env                   # add VITE_CLERK_PUBLISHABLE_KEY
npm run dev                            # → http://localhost:5173
```

> **⚠️ Start order matters:** Python → Spring Boot → React

### Environment Variables

| Variable | Where | Required | Purpose |
|---|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | `frontend/.env` | No* | User authentication |
| `FINNHUB_API_KEY` | System env | No* | Real-time market WebSocket |

_*App works without these — auth is skipped and live market data uses polling fallback._

### Database

**Default: H2 in-memory** — zero setup, data resets on restart.

For persistent MySQL:

```properties
# backend/src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/quantview
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=yourpassword
```

<br/>

## `007` — PROJECT MAP

```
quantview/
│
├── frontend/                        REACT 18 + TYPESCRIPT + VITE
│   ├── src/
│   │   ├── pages/                   Home, Dashboard, Market, About, Login, Settings
│   │   ├── components/
│   │   │   ├── charts/              StockChart (Recharts)
│   │   │   ├── market/              LiveQuoteCard, StockTable, SectorHeatmap
│   │   │   ├── layout/              AppSidebar, SearchBar
│   │   │   └── ui/                  50+ shadcn/ui primitives
│   │   ├── hooks/                   useStock, useMarketStream, useWatchlist, useTheme
│   │   ├── services/api.ts          All REST calls to :8080
│   │   ├── config/apiConfig.ts      Single source for API_BASE_URL
│   │   └── types/                   TypeScript interfaces
│   └── .env.example
│
├── backend/                         SPRING BOOT 3.4 + JAVA 17
│   └── src/main/java/com/quantview/
│       ├── controller/              Stock, Prediction, MarketData, Watchlist
│       ├── service/                 StockService, MarketDataService, WatchlistService
│       ├── config/                  CORS, Cache, CacheEvictor
│       ├── dto/                     ApiResponse<T>, StockPredictionDTO
│       ├── model/                   Watchlist, PredictionCache, LiveQuote
│       ├── repository/             JPA repositories
│       └── exception/              GlobalExceptionHandler
│
├── python-engine/                   FLASK + XGBOOST + PYTORCH
│   ├── app.py                       Flask routes (/predict, /stock, /health)
│   ├── model.py                     XGBoost + LSTM ensemble pipeline
│   ├── data_fetcher.py              yfinance + 13 feature engineering
│   ├── market_poller.py             Background market data thread
│   └── requirements.txt
│
└── README.md                        Main project overview
```

<br/>

## `008` — TECH STACK

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite | UI framework & build tool |
| **Styling** | Tailwind CSS, shadcn/ui (Radix) | Design system |
| **Charts** | Recharts | Financial data visualization |
| **Animation** | Framer Motion | Smooth UI transitions |
| **Auth** | Clerk | User authentication |
| **State** | TanStack Query (React Query) | Server state & caching |
| **Backend** | Java 17+, Spring Boot 3.4 | REST API orchestration |
| **ML Engine** | Python 3.10+, Flask | ML microservice |
| **ML Models** | XGBoost, PyTorch (LSTM) | Gradient boosting + deep learning |
| **ML Tools** | Scikit-learn, Pandas, NumPy | Data processing & metrics |
| **Data** | yfinance, Finnhub WebSocket | Historical + real-time market data |
| **Database** | H2 (dev) / MySQL (prod) | Watchlists & prediction cache |

<br/>

## `009` — ROADMAP

- [x] React dashboard with KPI cards, charts, signals
- [x] Spring Boot orchestration with caching & validation
- [x] XGBoost + LSTM ensemble ML pipeline
- [x] 13-feature engineering from raw OHLCV
- [x] Live market data via Finnhub WebSocket + SSE
- [x] Watchlist CRUD (frontend ↔ backend ↔ database)
- [x] Feature importances visualization
- [x] Consistent dark/light theming across all pages
- [x] Graceful offline handling
- [ ] Temporal Fusion Transformer model
- [ ] Multi-ticker portfolio optimization
- [ ] Docker Compose single-command deploy
- [ ] CI/CD with GitHub Actions

<br/>

## `010` — REFERENCES

- Chen & Guestrin (2016). _XGBoost: A Scalable Tree Boosting System._ KDD.
- Hochreiter & Schmidhuber (1997). _Long Short-Term Memory._ Neural Computation.
- [yfinance](https://pypi.org/project/yfinance/) · [Spring Boot](https://spring.io/projects/spring-boot) · [React](https://react.dev) · [scikit-learn](https://scikit-learn.org)

---

<div align="center">

**MIT License** · Built by [Kaif](https://github.com/Kaif89)

_"In God we trust. All others must bring data."_ — W. Edwards Deming

</div>
