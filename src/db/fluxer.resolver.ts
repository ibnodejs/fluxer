import { Resolver, Query, Arg, UseMiddleware } from "type-graphql";
import _get from "lodash/get";

import { log } from "@roadmanjs/logs";
import { MarketData, MarketDataModel } from "./fluxer.model";
import { queryMeasurement } from "./query";

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
      const points = await queryMeasurement({
        symbol,
        startDate,
        endDate,
      });

      const parsedData = points.map((d) => MarketDataModel.parse(d));
      return parsedData;
    } catch (error) {
      log("error getting marketdata", error);
      return [];
    }
  }
}

export default FluxerResolver;
