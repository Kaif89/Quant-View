<p align="center">
  <h1 align="center">📈 QuantView — StockTrend AI</h1>
  <p align="center">
    <em>An Algorithmic Market Analysis & Predictive Intelligence Platform</em>
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#roadmap">Roadmap</a> •
    <a href="#faq">FAQ</a>
  </p>
</p>

---

## 🧠 What is QuantView?

**QuantView** is a full-stack web application that bridges the gap between retail trading and quantitative analysis. Unlike standard brokerage platforms (Groww, Zerodha) that act as simple execution venues, QuantView serves as a **Decision Support System (DSS)** — it leverages Machine Learning pipelines to ingest historical stock data, mathematically model price trends, and visualize future market probabilities.

> **QuantView shifts the focus from *Transaction* to *Computation*.** It is a "Financial Research Lab" that provides data-driven insights rather than gut feeling.

### The Problem

| Limitation | Traditional Platforms | QuantView |
|---|---|---|
| **Data Output** | Historical charts (Past) | Predictive trend lines (Future) |
| **User Logic** | "Black Box" (Hidden algorithms) | "White Box" (Visible math & error rates) |
| **Primary Function** | Order execution | Data computation & trend analysis |
| **Tech Focus** | Database & concurrency | Data science & ML pipelines |

---

## ✨ Features

- **🔮 Predictive Analytics** — Real-time algorithmic forecasting using ML models. Calculates a mathematically derived trend line and projects the likely next-day closing price (T+1).
- **📊 Dynamic Data Visualization** — High-fidelity interactive dashboard with Recharts. Overlays predicted trends onto actual historical data to visualize volatility and deviation.
- **🔍 Algorithmic Transparency** — "White Box" approach displaying MSE, R² Score, and regression coefficients so users can judge model reliability.
- **📉 Technical Indicators** — Automatic computation of SMA-50 and SMA-200 overlays to identify bullish/bearish phases.
- **🌍 Multi-Market Support** — Search tickers from NSE, BSE, NYSE, NASDAQ, and any exchange supported by Yahoo Finance.
- **⭐ Watchlist & Persistence** — Save frequently tracked stocks for one-click analysis, backed by a MySQL database.
- **🌗 Theme Toggle** — Premium dark/light mode with smooth pill-shaped toggle and transition animations.
- **🔐 Authentication** — Secure user management with Clerk.

---

## 🏗️ Architecture

QuantView follows a **Distributed Microservices-Lite Architecture**:

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  React 18 + TypeScript + Recharts + Tailwind CSS + Framer Motion│
│            Port 5173 — Interactive Dashboard & Charts            │
└──────────────────────┬───────────────────────────────────────────┘
                       │ HTTP / REST API
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                    ORCHESTRATION LAYER                            │
│           Java Spring Boot — Port 8080                           │
│     Input Validation • CORS • Request Routing • Caching          │
└──────────────────────┬───────────────────────────────────────────┘
                       │ HTTP / ProcessBuilder
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                   COMPUTATION ENGINE                             │
│        Python + Flask/FastAPI + Scikit-learn — Port 5000         │
│   yfinance Data Ingestion • Feature Engineering • ML Pipeline    │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  Yahoo Finance   │
              │   (External API) │
              └──────────────────┘
```

### Data Flow

```
User (React UI) ─→ Spring Boot (Guard/Router) ─→ Python (Math Lab) ─→ Spring Boot ─→ User
```

1. **Data Request** — User inputs a stock ticker → frontend sends HTTP GET to Spring Boot
2. **Orchestration** — Spring Boot validates input → forwards to Python ML engine
3. **Computation** — Python fetches data via `yfinance` → trains model → generates prediction
4. **Visualization** — Results sent back through Spring Boot → React renders interactive charts

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite | UI framework & build tool |
| **Styling** | Tailwind CSS, shadcn/ui (Radix) | Design system |
| **Charts** | Recharts | Financial data visualization |
| **Animation** | Framer Motion, GSAP, Lenis | Smooth UI transitions |
| **Auth** | Clerk | User authentication |
| **State** | TanStack Query | Server state management |
| **Backend** | Java, Spring Boot | REST API orchestration |
| **ML Engine** | Python, Flask/FastAPI | ML microservice |
| **ML Libraries** | Scikit-learn, Pandas, NumPy | Data processing & modeling |
| **Data Source** | yfinance | Real-time stock data |
| **Database** | MySQL | Watchlists & cached data |
| **Testing** | Vitest, JUnit | Automated testing |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (with npm or Bun)
- **Java** 17+ (for Spring Boot backend)
- **Python** 3.10+ (for ML engine)
- **MySQL** 8.0+ (for persistence)

### 1. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
bun install

# Configure environment variables
cp .env.example .env
# Edit .env with your Clerk and API keys

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### 2. Python ML Engine Setup

```bash
cd python-engine

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install flask yfinance scikit-learn pandas numpy

# Start the ML service
python app.py
```

The ML engine will run on `http://localhost:5000`.

### 3. Spring Boot Backend Setup

```bash
cd backend

# Build and run
./mvnw spring-boot:run
```

The backend will run on `http://localhost:8080`.

### Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk authentication key | ✅ |
| `VITE_ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key | ✅ |

---

## 📂 Project Structure

```
quantview/
├── frontend/                    # React + TypeScript UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── layout/          # App layout (sidebar, search)
│   │   │   ├── charts/          # StockChart, DonutChart
│   │   │   └── ...              # ThemeToggle, LiveClock, etc.
│   │   ├── pages/               # Home, Dashboard, About, Login, Settings
│   │   ├── hooks/               # useStock, useAuth, useTheme
│   │   ├── types/               # TypeScript interfaces
│   │   └── lib/                 # Utility functions
│   └── ...
├── backend/                     # Java Spring Boot (TODO)
│   ├── src/main/java/
│   │   ├── controller/          # StockController.java
│   │   ├── service/             # MarketService.java
│   │   └── config/              # CORS, Security
│   └── ...
├── python-engine/               # Python ML Microservice (TODO)
│   ├── app.py                   # Flask/FastAPI server
│   ├── model.py                 # Linear Regression pipeline
│   ├── data_fetcher.py          # yfinance integration
│   └── requirements.txt
└── README.md
```

---

## 🗺️ Roadmap

### ✅ Phase 1: Frontend Dashboard (Current)

- [x] Project initialization (Vite + React + TypeScript)
- [x] Tailwind CSS + shadcn/ui design system
- [x] Page routing (Home, Dashboard, About, Login, Settings)
- [x] Interactive stock charts with Recharts
- [x] Theme toggle (dark/light mode) with premium animations
- [x] Clerk authentication integration
- [x] Responsive layout with sidebar navigation
- [x] Custom cursor, smooth scroll, and micro-animations

### ✅ Phase 2: Backend & ML Engine (Next)

- [x] Python ML microservice with Flask/FastAPI
- [x] yfinance data ingestion pipeline
- [x] Linear Regression model training & prediction
- [x] Spring Boot REST API (orchestration layer)
- [x] CORS configuration for cross-origin requests
- [x] MySQL database for watchlists & caching

### 🔲 Phase 3: Integration & Polish

- [ ] End-to-end data flow (React → Spring Boot → Python → Response)
- [ ] Error handling (invalid tickers, API timeouts)
- [ ] Toast notifications for user feedback
- [ ] Performance optimization & caching
- [ ] Advanced ML models (see [Algorithm Recommendations](#-algorithm-upgrade-recommendations))

---

## 🧪 Algorithm Upgrade Recommendations

> Linear Regression is a solid starting point, but here are more advanced models to consider for better prediction accuracy:

### Tier 1: Drop-in Upgrades (Easy)

| Algorithm | Why It's Better | Complexity |
|---|---|---|
| **Ridge / Lasso Regression** | Adds regularization to prevent overfitting. Drop-in replacement for `LinearRegression()`. | ⭐ Easy |
| **Polynomial Regression** | Captures non-linear trends (curves) that linear models miss. Stock prices rarely move in straight lines. | ⭐ Easy |
| **ElasticNet** | Combines Ridge + Lasso for balanced regularization. Great when you have many features. | ⭐ Easy |

### Tier 2: Significant Improvements (Medium)

| Algorithm | Why It's Better | Complexity |
|---|---|---|
| **Random Forest Regressor** | Ensemble of decision trees. Captures complex non-linear relationships and is resistant to overfitting. | ⭐⭐ Medium |
| **Gradient Boosting (XGBoost / LightGBM)** | State-of-the-art for tabular data. Sequentially builds trees to correct errors. Used by quant funds. | ⭐⭐ Medium |
| **Support Vector Regression (SVR)** | Finds the optimal hyperplane in high-dimensional space. Excellent for small-to-medium datasets. | ⭐⭐ Medium |

### Tier 3: High-End Models (Advanced)

| Algorithm | Why It's Better | Complexity |
|---|---|---|
| **LSTM (Long Short-Term Memory)** | Deep learning model specifically designed for time-series data. Remembers long-term dependencies in price patterns. | ⭐⭐⭐ Advanced |
| **GRU (Gated Recurrent Unit)** | Lighter version of LSTM with similar performance. Faster to train. | ⭐⭐⭐ Advanced |
| **Transformer (Time-Series)** | Attention-based architecture (like GPT but for numbers). Captures complex temporal relationships. Libraries: `pytorch-forecasting`. | ⭐⭐⭐⭐ Expert |
| **Prophet (by Meta)** | Designed for business time-series forecasting. Handles seasonality, holidays, and trend changes automatically. | ⭐⭐ Medium |

### 🏆 Recommended Next Step: **XGBoost + LSTM Ensemble**

For the best balance of accuracy and implementation effort:

1. **Start with XGBoost** — Replace `LinearRegression()` with `XGBRegressor()`. Add features like SMA-50, SMA-200, RSI, MACD, and volume. This alone will dramatically improve predictions.

2. **Add LSTM** — Build a secondary LSTM model using `tensorflow`/`pytorch` that learns sequential price patterns over 60-day windows.

3. **Ensemble** — Average or weight the predictions from both models. XGBoost captures feature relationships; LSTM captures temporal patterns.

```python
# Example: XGBoost upgrade (drop-in replacement)
from xgboost import XGBRegressor

model = XGBRegressor(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    objective='reg:squarederror'
)
model.fit(X_train, y_train)
prediction = model.predict(X_test)
```

---

## ❓ FAQ

<details>
<summary><strong>What is QuantView?</strong></summary>
QuantView is a web-based application for algorithmic market analysis. It visualizes historical stock data and generates mathematically derived predictions for future price trends.
</details>

<details>
<summary><strong>Which markets are supported?</strong></summary>
NYSE, NASDAQ, NSE (India), BSE, and any exchange supported by Yahoo Finance. Use suffixes like <code>.NS</code> for NSE stocks (e.g., <code>RELIANCE.NS</code>).
</details>

<details>
<summary><strong>How does the prediction work?</strong></summary>
The system analyzes the past 2 years of closing prices using ML algorithms to calculate a trend line and project the likely next-day closing price. Statistical metrics (MSE, R²) are displayed alongside every prediction.
</details>

<details>
<summary><strong>Is the data real-time?</strong></summary>
Yes, the application fetches the latest available market data for every prediction. There may be a ~15 minute delay depending on the data provider.
</details>

<details>
<summary><strong>Can I trust the predictions?</strong></summary>
Predictions are based on mathematical probability, not certainty. The application displays error metrics (MSE, R²) so you can judge reliability. <strong>This is a research tool, not financial advice.</strong>
</details>

<details>
<summary><strong>What if a ticker is not found?</strong></summary>
Double-check the symbol spelling. Use exchange suffixes for non-US stocks (e.g., <code>RELIANCE.NS</code> for NSE). If the issue persists, the stock may not be listed on Yahoo Finance.
</details>

---

## 📚 References

- Pedregosa, F., et al. (2011). *Scikit-learn: Machine Learning in Python.* JMLR.
- Yahoo Finance — [yfinance API Documentation](https://pypi.org/project/yfinance/)
- Spring Boot — [Reference Documentation](https://spring.io/projects/spring-boot)
- React — [Official Documentation](https://react.dev/)
- Murphy, K. P. (2012). *Machine Learning: A Probabilistic Perspective.* MIT Press.

---

## 📄 License

MIT

---

<p align="center">
  <strong>Built with ❤️ for quantitative finance enthusiasts</strong>
</p>
