import { GetBars } from "../providers";
import { MarketDataSchema } from "./marketdata.schema";
import { isCache } from "../config";
import isEmpty from "lodash/isEmpty";
import { log } from "@roadmanjs/logs";
import { minimumMarketData } from "../cache/compare";
import { queryMeasurement } from "./query";

export const isEnoughMarketData = () => {};

export const GetMarketData = async (
  args: GetBars
): Promise<MarketDataSchema[]> => {
  const { symbol, end, start, crypto } = args;

  log("query", args);

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
  try {
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

    if (isCache && returnedCount < expectedCount) {
      // Get from provider
      // save to cache
      // return the provider data
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
