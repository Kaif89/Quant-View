# QuantView ML Engine

Python microservice that fetches stock data via yfinance, trains ML models, and returns predictions.

## Setup

```bash
cd python-engine

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

The server will run on `http://localhost:5000`.

## Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/predict?ticker={symbol}` | GET | Fetch data, train model, return prediction |
| `/health` | GET | Health check |

## Example

```bash
curl http://localhost:5000/predict?ticker=AAPL
```

## Models

The engine trains both **LinearRegression** and **XGBRegressor**, picks the one with better R² score, and uses it for the final prediction.
