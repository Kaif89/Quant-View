import time
import json
import threading
import os
from batch_quotes import fetch_batch_quotes, push_quotes_to_springboot

POLL_INTERVAL = 60 # Seconds

def load_universe():
    """ 
    Load the universe from the backend Java resources.
    This guarantees Python targets exactly what the frontend anticipates.
    """
    path = os.path.join(os.path.dirname(__file__), "..", "backend", "src", "main", "resources", "market-universe.json")
    try:
        with open(path, 'r') as file:
            config = json.load(file)

        symbols = []
        # Flatten all values regardless of category
        def extract(d):
            if isinstance(d, dict):
                for k, v in d.items(): extract(v)
            elif isinstance(d, list):
                symbols.extend(d)

        extract(config)
        
        # Deduplicate
        return list(set(symbols))
            
    except Exception as e:
        print(f"[MarketPoller] Failed to load market-universe.json: {e}")
        # Return a safe fallback slice
        return ["AAPL", "MSFT", "RELIANCE.NS", "SPY", "BTC"]

def poller_loop():
    print(f"[MarketPoller] Initiated Daemon Poller. Interval: {POLL_INTERVAL}s")
    
    symbols = load_universe()
    if not symbols:
        print("[MarketPoller] No tracking symbols found. Poller terminating.")
        return
        
    while True:
        try:
            # 1. Dispatch batch YF downloads
            quotes = fetch_batch_quotes(symbols)
            
            # 2. Re-distribute back to Spring Boot
            if quotes:
                push_quotes_to_springboot(quotes)
                
        except Exception as e:
            print(f"[MarketPoller] Poller Cycle Exception: {e}")
            
        time.sleep(POLL_INTERVAL)

def start_poller_thread():
    """
    Spawns the background Daemon Thread avoiding blocking Flask
    """
    thread = threading.Thread(target=poller_loop, daemon=True)
    thread.start()
    return thread
