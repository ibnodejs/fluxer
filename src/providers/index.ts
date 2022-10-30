import { MarketDataSchema, TickerData } from "../db/marketdata.schema";

export interface GetBars {
  start: Date;
  end: Date;
  symbol: string;
  crypto?: boolean;
}

export interface Provider {
  getBars: (args: GetBars) => Promise<MarketDataSchema[]>;
  getTicker?: (symbol: string) => Promise<TickerData | null>;
}

// writer off thread
export const saveCache = () => {};
