"""
data_fetcher.py — yfinance data ingestion + technical indicator calculation.

Fetches 2 years of daily OHLCV data for a given ticker, cleans it, and computes
SMA-20, SMA-50, SMA-200, and EMA-20.
"""

import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta


import requests

def fetch_stock_data(ticker: str, period_years: int = 2) -> pd.DataFrame:
    """
    Download historical stock data from Yahoo Finance and compute technical indicators.

    Args:
        ticker: Stock ticker symbol (e.g., "AAPL", "RELIANCE.NS").
        period_years: Number of years of historical data to fetch.

    Returns:
        Cleaned pandas DataFrame with OHLCV + SMA/EMA columns.

    Raises:
        ValueError: If ticker returns no data or API fails.
        TimeoutError: If yfinance/requests times out.
    """
    end_date = datetime.now()
    start_date = end_date - timedelta(days=period_years * 365)

    print(f"[DataFetcher] Downloading {ticker} from {start_date.date()} to {end_date.date()}")

    try:
        stock = yf.Ticker(ticker)
        df = stock.history(start=start_date, end=end_date, auto_adjust=True, timeout=10)
    except requests.exceptions.Timeout:
        raise TimeoutError("Market data unavailable, try again")
    except Exception as e:
        raise ValueError(f"Failed to fetch market data for {ticker}: {str(e)}")

    if df is None or df.empty:
        raise ValueError(f"No data returned for ticker: {ticker}")

    # Standardize column names to lowercase
    df.columns = [col.lower() for col in df.columns]

    # Keep only OHLCV columns
    required_cols = ['open', 'high', 'low', 'close', 'volume']
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Missing expected column: {col}")

    df = df[required_cols].copy()

    # Clean: drop NaN rows, sort by date ascending
    df.dropna(inplace=True)
    df.sort_index(inplace=True)

    # Reset index to get date as a column
    df.index.name = 'date'
    df.reset_index(inplace=True)
    df['date'] = pd.to_datetime(df['date']).dt.strftime('%Y-%m-%d')

    # ── Technical Indicators ──

    close = df['close']

    # Simple/Exponential Moving Averages
    df['sma_20']  = close.rolling(window=20, min_periods=1).mean()
    df['sma_50']  = close.rolling(window=50, min_periods=1).mean()
    df['sma_200'] = close.rolling(window=200, min_periods=1).mean()
    df['ema_20']  = close.ewm(span=20, adjust=False).mean()

    # RSI (14-day)
    delta = close.diff()
    gain = delta.where(delta > 0, 0.0)
    loss = -delta.where(delta < 0, 0.0)
    avg_gain = gain.rolling(window=14, min_periods=1).mean()
    avg_loss = loss.rolling(window=14, min_periods=1).mean()
    rs = avg_gain / avg_loss
    df['rsi_14'] = 100 - (100 / (1 + rs))

    # MACD
    ema_12 = close.ewm(span=12, adjust=False).mean()
    ema_26 = close.ewm(span=26, adjust=False).mean()
    df['macd'] = ema_12 - ema_26
    df['macd_signal'] = df['macd'].ewm(span=9, adjust=False).mean()

    # Bollinger Bands
    std_20 = close.rolling(window=20, min_periods=1).std()
    df['bb_upper'] = df['sma_20'] + (std_20 * 2)
    df['bb_lower'] = df['sma_20'] - (std_20 * 2)

    # Returns & Volume
    df['daily_return'] = close.pct_change().fillna(0)
    df['volume_change'] = df['volume'].pct_change().fillna(0)

    # Lags (Historical contextual features)
    df['lag_1'] = close.shift(1)
    df['lag_2'] = close.shift(2)
    df['lag_3'] = close.shift(3)
    df['lag_5'] = close.shift(5)

    print(f"[DataFetcher] Fetched {len(df)} rows for {ticker} with features.")

    return df
