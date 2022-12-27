import { MarketData, TickerData } from "../db/fluxer.model";

import { KrakenProvider } from "./kraken";
import { POLYGON_KEY } from "../config";
import { PolygonProvider } from "./polygon";
import isEmpty from "lodash/isEmpty";

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
export const saveCache = () => { };

export const getProvider = (): Provider => {
  if (isEmpty(POLYGON_KEY)) {
    return new KrakenProvider();
  }
  return new PolygonProvider();
}
