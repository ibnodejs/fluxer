import { GetBars, Provider } from ".";
import { IRestClient, restClient } from "@polygon.io/client-js";

import { POLYGON_KEY } from "../config";
import { TickerData } from "../db/fluxer.model";
import { log } from "roadman";

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

    const apiParams = `apiKey=${POLYGON_KEY}`;

    if (tickerDetails.results) {
      const ticker = tickerDetails.results;
      const results: TickerData = {
        name: ticker.name,
        description: ticker.description,
        locale: ticker.locale,
        symbol,
        icon: `${ticker.branding?.logo_url || ""}?${apiParams}`,
        logo: `${ticker.branding?.icon_url || ""}?${apiParams}`,
        market: ticker.market, // TODO
        industry: ticker.sic_description,
      };
      log(`PolygonProvider:Ticker ${symbol} -> results: ${results}`);
      return results;
    }

    return null;
  }
}
