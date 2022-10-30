import { GetBars, Provider } from ".";

import { FinnhubAPI } from "@stoqey/finnhub";
import isEmpty from "lodash/isEmpty";
import { log } from "roadman";
import { writeMeasurement } from "../db/write";

const FINNHUB_KEY = process.env.FINNHUB_KEY;

// start client from here
// TODO match types
export class FinnhubProvider implements Provider {
  async getBars(args: GetBars): Promise<any[]> {
    const { start, end, symbol } = args;

    const finnhubApi = new FinnhubAPI(FINNHUB_KEY);

    const data = await finnhubApi.getCandles(symbol, start, end, "1");

    log(`FinnhubProvider: ${symbol} -> start: ${start} - end: ${end}`);

    const marketdata = data.map((d) => ({
      close: d.close,
      open: d.open,
      date: d.date,
      volume: d.volume,
      high: d.high,
      low: d.low,
      symbol,
    }));

    log(`FinnhubProvider: ${symbol} -> total: ${marketdata.length}`);
    // console.log("first", data[0]);

    if (!isEmpty(marketdata)) {
      // @ts-ignore
      await writeMeasurement(marketdata);
    }

    return marketdata;
  }
}
