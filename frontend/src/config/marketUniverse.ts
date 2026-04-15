export const MARKET_UNIVERSE = {
  us: {
    indices: ["SPY", "QQQ", "DIA", "IWM"],
    tech: ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "AMD", "INTC", "ORCL"],
    finance: ["JPM", "BAC", "GS", "MS", "V", "MA"],
    healthcare: ["JNJ", "PFE", "UNH", "ABBV"],
    energy: ["XOM", "CVX"],
    consumer: ["WMT", "COST", "NKE", "MCD"]
  },
  in: {
    indices: ["^NSEI", "^BSESN", "^NSEBANK"],
    tech: ["INFY.NS", "TCS.NS", "WIPRO.NS", "HCLTECH.NS", "TECHM.NS"],
    finance: ["HDFCBANK.NS", "ICICIBANK.NS", "SBIN.NS", "AXISBANK.NS", "KOTAKBANK.NS"],
    auto: ["TATAMOTORS.NS", "MARUTI.NS", "M&M.NS"],
    conglomerate: ["RELIANCE.NS", "ADANIENT.NS", "TATASTEEL.NS"],
    pharma: ["SUNPHARMA.NS", "DRREDDY.NS", "CIPLA.NS"]
  },
  crypto: ["BTC-USD", "ETH-USD", "SOL-USD", "BNB-USD", "XRP-USD"]
};

// Helper to flatten categories for raw tracking
export const getAllTrackedSymbols = (): string[] => {
  const symbols: string[] = [];
  
  const extract = (obj: any) => {
    Object.values(obj).forEach(val => {
      if (Array.isArray(val)) {
        symbols.push(...val);
      } else if (typeof val === 'object') {
        extract(val);
      }
    });
  };
  
  extract(MARKET_UNIVERSE);
  return Array.from(new Set(symbols)); // Deduplicate
};
