import yfinance as yf
import pandas as pd
import time
import requests
import json
import os
from datetime import datetime

# Fallback structure logic to push to Spring Boot REST Endpoint
SPRING_BOOT_URL = os.getenv('SPRING_BOOT_URL', 'http://localhost:8080')

def fetch_batch_quotes(symbols):
    """
    Downloads bulk snapshot from yfinance and restructures into a Java LiveQuote-compatible payload.
    Chunk requests into multiple parts if needed, but for typical use < 50 limits are fine.
    """
    
    if not symbols:
        return []

    print(f"[YF-Batch] Fetching latest snapshot for {len(symbols)} tracked tickers...")
    
    # We replace any crypto representations like '.NS' if yfinance rejects them loosely,
    # but normally yf handles .NS exactly fine.
    yf_symbols = [str(s) + "-USD" if str(s) in ["BTC", "ETH", "SOL", "BNB", "XRP"] else str(s) for s in symbols]
    
    quotes = []

    # Use a custom session with a regular browser user-agent to bypass the yfinance bot block
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })

    # To avoid triggering rate limits on bulk arrays, we fetch one by one
    for idx, original_symbol in enumerate(symbols):
        yf_sym = yf_symbols[idx]
        
        try:
            # progress=False hides the repetitive loading bars for 100+ tickers
            data = yf.download(yf_sym, period="2d", interval="1d", auto_adjust=False, progress=False, session=session)
            
            ticker_df = data.dropna()

            if ticker_df.empty or len(ticker_df) < 1:
                continue

            last_row = ticker_df.iloc[-1]
            prev_row = ticker_df.iloc[-2] if len(ticker_df) > 1 else last_row
            
            # Extract scalar values safely (pandas 3.0 compat)
            def safe_float(val, default=0.0):
                try:
                    return float(val.iloc[0]) if hasattr(val, 'iloc') else float(val)
                except (IndexError, TypeError, ValueError):
                    return default

            def safe_int(val, default=0):
                try:
                    return int(val.iloc[0]) if hasattr(val, 'iloc') else int(val)
                except (IndexError, TypeError, ValueError):
                    return default

            price = safe_float(last_row.get("Close", 0))
            prev_close = safe_float(prev_row.get("Close", 0))
            
            # Adjust if same day (fallback)
            if price == 0: price = prev_close
            
            change = price - prev_close
            change_percent = (change / prev_close) * 100 if prev_close else 0.0
            
            high = safe_float(last_row.get("High", price))
            low = safe_float(last_row.get("Low", price))
            volume = safe_int(last_row.get("Volume", 0))
            
            # Form standard Live Quote payload
            quote = {
                "symbol": original_symbol,
                "exchange": "CRYPTO" if "-USD" in yf_sym else ("NSE" if ".NS" in yf_sym else "US"),
                "price": round(price, 2),
                "prevClose": round(prev_close, 2),
                "change": round(change, 2),
                "changePercent": round(change_percent, 2),
                "dayHigh": round(high, 2),
                "dayLow": round(low, 2),
                "volume": volume,
                "timestamp": int(time.time() * 1000)
            }
            quotes.append(quote)
            
            # Small delay to mimic human traffic, avoiding rate-limiting WAF
            time.sleep(0.5)
            
        except Exception as e:
            # We catch single ticker failures silently to not tank the entire batch loop
            continue

    return quotes

def push_quotes_to_springboot(payload):
    """ Post the JSON batch payload directly into Java's MarketDataService loop """
    try:
        url = f"{SPRING_BOOT_URL}/api/market/internal/ingest"
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 200:
            print(f"[YF-Batch] Successfully pushed {len(payload)} fallbacks to Spring Boot.")
        else:
            print(f"[YF-Batch] Failed to push to JVM. HTTP {response.status_code}")
    except Exception as e:
        print(f"[YF-Batch] Unable to reach Spring Boot ({url}): {e}")
