import { GetBars, Provider } from ".";
import { IRestClient, restClient } from "@polygon.io/client-js";

import { TickerData } from "src/db/marketdata.schema";
import { log } from "roadman";

const POLYGON_KEY = process.env.POLYGON_KEY;

// start client from here
// TODO match types
export class PolygonProvider implements Provider {
  provider: IRestClient;
  constructor() {
    this.provider = restClient(POLYGON_KEY);
  }
  async getBars(args: GetBars): Promise<any[]> {
    const { start, end, symbol } = args;

    log(`PolygonProvider: ${symbol} -> start: ${start} - end: ${end}`);

    const returnedBars = await this.provider.stocks.aggregates(
      symbol,
      1,
      "minute",
      start.getTime().toString(),
      end.getTime().toString(),
      {
        limit: 5000,
        adjusted: "false",
      }
    );

    const marketdata = (returnedBars.results || []).map((d) => ({
      close: d.c,
      open: d.o,
      date: d.t ? new Date(d.t) : null,
      volume: d.v,
      high: d.h,
      low: d.l,
      symbol,
    }));

    log(`PolygonProvider: ${symbol} -> total: ${marketdata.length}`);

    return marketdata;
  }

  async getTicker(symbol: string): Promise<TickerData | null> {
    const polygonRest = this.provider;

    log(`PolygonProvider:Ticker ${symbol}`);

    const tickerDetails = await polygonRest.reference.tickerDetails(symbol);

    if (tickerDetails.results) {
      const results: TickerData = {
        symbol,
        logo: tickerDetails.results.branding?.logo_url || "",
        industry: tickerDetails.results.market, // TODO
      };
      log(`PolygonProvider:Ticker ${symbol} -> results: ${results}`);
      return results;
    }

    return null;
  }
}
