import { Resolver, Query, Arg, UseMiddleware } from "type-graphql";
import _get from "lodash/get";

import { log } from "@roadmanjs/logs";
import { MarketData, MarketDataModel, TickerData } from "./fluxer.model";
import { queryMeasurement } from "./query";
import { QueryTickerData, QueryMarketData } from "./cache";

@Resolver()
export class FluxerResolver {
  @Query(() => [MarketData])
  // @UseMiddleware(isAuth)
  async getMarketData(
    @Arg("symbol", { nullable: false }) symbol: string,
    @Arg("startDate", { nullable: false }) startDate: Date,
    @Arg("endDate", { nullable: true }) endDate: Date
  ): Promise<MarketData[]> {
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
  }

  @Query(() => TickerData)
  async getTicker(
    @Arg("symbol", { nullable: false }) symbol: string
  ): Promise<TickerData | null> {
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
  }
}

export default FluxerResolver;
