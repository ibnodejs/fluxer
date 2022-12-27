import { GetBars, getProvider } from "../providers";

import { MarketDataSchema } from "./marketdata.schema";
import { PolygonProvider } from "../providers/polygon";
import { isCache } from "../config";
import isEmpty from "lodash/isEmpty";
import { log } from "@roadmanjs/logs";
import { minimumMarketData } from "../cache/compare";
import { queryMeasurement } from "./query";
import { writeMeasurement } from "./write";
export const QueryMarketData = async (
  args: GetBars
): Promise<MarketDataSchema[]> => {
  const { symbol, end, start, crypto } = args;

  log("QueryMarketData", args);

  const startDate = new Date(start);

  const { startingDate, endingDate } = (() => {
    // if we have endDate
    if (end) {
      return {
        endingDate: new Date(end),
        startingDate: new Date(startDate),
      };
    }

    // Else clone startDate, go back a day in the past and set as endingDate
    const cloneStartDate = new Date(startDate);
    let startingDate = new Date(
      cloneStartDate.setDate(cloneStartDate.getDate() - 1)
    );
    let endingDate = startDate;

    return {
      endingDate,
      startingDate,
    };
  })();

  log("dates are", { startingDate, endingDate });

  let data: MarketDataSchema[] = [];

  const provider = getProvider();
  const getBars = () =>
    provider.getBars({
      symbol,
      start: startingDate,
      end: endingDate,
    });

  try {
    if (isCache) {
      // query and compare cache
      data = await queryMeasurement({
        symbol,
        startDate: startingDate,
        endDate: endingDate,
      });

      log("data response is", data && data.length);

      const returnedCount = data.length;
      const expectedCount = minimumMarketData({
        crypto,
        start: startingDate,
        end: endingDate,
      });

      if (returnedCount < expectedCount) {
        // Get from provider
        data = await getBars();
        // save to cache
        await writeMeasurement(data)
      }
    } else {
      // query provider and return provider data
      data = await getBars();
    }

    if (isEmpty(data)) {
      throw new Error("Error market data null");
    }
    return data;
  } catch (error) {
    log("error getting candles", error);
    return [];
  }
};

export const QueryTickerData = async (symbol: string) => {
  try {
    const provider = new PolygonProvider();
    const tickerDetails = await provider.getTicker(symbol);
    return tickerDetails;
  } catch (error) {
    return null;
  }
};
