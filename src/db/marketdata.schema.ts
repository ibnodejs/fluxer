export const MarketDataMeasurement = "market";
export interface MarketDataSchema {
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  date: Date;
}
