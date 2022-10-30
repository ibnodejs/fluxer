import { MarketData, TickerData } from "../db/fluxer.model";

export interface GetBars {
  start: Date;
  end: Date;
  symbol: string;
  crypto?: boolean;
}

export interface Provider {
  getBars: (args: GetBars) => Promise<MarketData[]>;
  getTicker?: (symbol: string) => Promise<TickerData | null>;
}

// writer off thread
export const saveCache = () => {};
