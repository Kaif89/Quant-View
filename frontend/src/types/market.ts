export interface LiveQuote {
    symbol: string;
    companyName?: string;
    exchange: string;
    sector?: string;
    price: number;
    prevClose: number;
    change: number;
    changePercent: number;
    dayHigh: number;
    dayLow: number;
    volume: number;
    timestamp: number;
    isMarketOpen: boolean;
    currency?: string;
}
