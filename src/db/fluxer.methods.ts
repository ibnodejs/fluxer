import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";
import { MarketData, MarketDataModel, TickerData } from "./fluxer.model";
import { QueryMarketData, QueryTickerData } from "./cache";

import _get from "lodash/get";
import { log } from "@roadmanjs/logs";
import { queryMeasurement } from "./query";

export const getMarketData = async ({
  symbol,
  startDate,
  endDate,
}: {
  symbol: string;
  startDate: Date;
  endDate: Date;
}): Promise<MarketData[]> => {
  try {
    log("getMarketData", {
      symbol,
      start: startDate,
      end: endDate,
    });

    const points = await QueryMarketData({
      symbol,
      start: startDate,
      end: endDate,
    });

    const parsedData = points.map((d) => MarketDataModel.parse(d));
    return parsedData;
  } catch (error) {
    log("error getting marketdata", error);
    return [];
  }
};

export const getTicker = async (symbol: string): Promise<TickerData | null> => {
  try {
    log("getTicker", {
      symbol,
    });
    const tickerDetails = await QueryTickerData(symbol);
    return tickerDetails;
  } catch (error) {
    log("error getting marketdata", error);
    return null;
  }
};
