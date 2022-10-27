import { GetBars, Provider } from ".";

import { log } from "roadman";
import { restClient } from "@polygon.io/client-js";

const POLYGON_KEY = process.env.POLYGON_KEY;

// start client from here
// TODO match types
export class PolygonProvider implements Provider {
  async getBars(args: GetBars): Promise<any[]> {
    const { start, end, symbol } = args;

    const polygonRest = restClient(POLYGON_KEY);

    log(`PolygonProvider: ${symbol} -> start: ${start} - end: ${end}`);

    const returnedBars = await polygonRest.stocks.aggregates(
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
}
