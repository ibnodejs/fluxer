/**
 * A tiny provider for minute data, not more than month
 */
import "dotenv/config";
import "reflect-metadata";

import { CircleMdRange, circleCurrentAnd3yearsBack } from "../utils/date.utils";

import { FinnhubProvider } from "../providers/finnhub";
import { GetBars } from "../providers";
import delay from "lodash/delay";
import flatten from "lodash/flatten";
import { getChunkRanges } from "../utils/date";
// import fs from "fs";
import { log } from "@roadmanjs/logs";
import values from "lodash/values";

// import { writeMeasurement } from "../fluxer/write";
/**
 * GetBars from AlpacaClient
 * TODO push to influx DB once collected
 * since UI pulls from influx only
 * @param args
 * @returns
 */
export const getBars = async (args: GetBars): Promise<any[]> => {
  let bars: Bar[] = [];
  let count = 1;
  let page_token = "";

  const initBars = await client.getBars(args);

  if (initBars.next_page_token) {
    page_token = initBars.next_page_token;
  }

  bars.push(...initBars.bars);

  while (page_token != null) {
    let resp = await client.getBars({ ...args, page_token } as any);
    bars.push(...resp.bars);
    page_token = resp.next_page_token;
    log("getBars", {
      apiCalls: count,
      length: bars.length,
      symbol: args.symbol,
    });
    ++count;
  }

  const marketData = bars.map((d) => ({
    close: d.c,
    open: d.o,
    symbol: args.symbol,
    date: d.t,
    volume: d.v,
    high: d.h,
    low: d.l,
  }));

  // if (!isEmpty(marketData)) {
  //   await writeMeasurement(marketData);
  // }

  //  TODO pass fluxer client
  return marketData;
};

// TODO check fluxer if years exists before saving

export const circleMarketData = async (symbol: string) => {
  // only for demo
  // await fluxerRoadman({} as any);

  // const Ibkr = new IbkrProvider();
  const provider = new FinnhubProvider();

  const getMonthRanges = circleCurrentAnd3yearsBack();

  // TODO
  // check existing ranges

  // TODO
  // filter existing date ranges

  const ranges: CircleMdRange[] = flatten(values(getMonthRanges.years));

  // loop thru all the ranges and save
  while (ranges.length > 0) {
    const currentRange = ranges.shift();

    if (currentRange) {
      await provider.getBars({
        symbol,
        start: currentRange?.startOfMonth,
        end: currentRange?.endOfMonth,
        timeframe: "1Min",
      });

      await delay(() => {}, 3000);
    }
  }
};

export const circleMarketDataCrypto = async (symbol: string) => {
  const provider = new FinnhubProvider();
  const getMonthRanges = circleCurrentAnd3yearsBack();

  const circleRanges: CircleMdRange[] = flatten(values(getMonthRanges.years));
  const startDate = circleRanges.shift()?.startOfMonth;
  const endDate = circleRanges.pop()?.endOfMonth;

  // @ts-ignore
  const ranges = getChunkRanges(startDate, endDate);

  // loop thru all the ranges and save
  while (ranges.length > 0) {
    const currentRange = ranges.shift();

    if (currentRange) {
      await provider.getBars({
        symbol,
        start: currentRange?.start,
        end: currentRange?.end,
        timeframe: "1Min",
      });

      await delay(() => {}, 3000);
    }
  }
};

// circleMarketDataCrypto("XXXX");

// console.log(circleMarketData("TSLA"));

// console.log(getThreeYearsBack());

// console.log(getCurrentUptodateMonths());

// console.log(getMonthsToDate(new Date("12-30-2022")));

// getBars({
//   symbol: "TSLA",
//   start: new Date("04-01-2022"),
//   end: new Date("04-30-2022"),
//   timeframe: "1Min",
// }).then((data) => {
//   const dataX = data.map((d) => ({
//     close: d.c,
//     open: d.o,
//     symbol: "TSLA",
//     date: d.t,
//     volume: d.v,
//     high: d.h,
//     low: d.l,
//   }));
//   fs.writeFileSync("./TSLA.json", JSON.stringify(dataX), { encoding: "utf8" });
// });
