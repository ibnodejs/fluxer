import { Resolver, Query, Arg, UseMiddleware } from "type-graphql";
import _get from "lodash/get";
import { log } from "roadman";
import { MarketData, MarketDataModel } from "./fluxer.model";
import { queryMeasurement } from "../db/query";

@Resolver()
export class FluxerResolver {
  @Query(() => [MarketData])
  async getMarketData(
    @Arg("symbol", () => String, { nullable: false }) symbol: string,
    @Arg("startDate", () => Date, { nullable: false }) startDate: Date,
    @Arg("endDate", () => Date, { nullable: true }) endDate: Date
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
