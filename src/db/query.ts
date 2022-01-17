import { MarketDataMeasurement, MarketDataSchema } from "./marketdata.schema";
import { bucket, org } from "../config";

/**
 * Query for any measurements
 */
import { Point } from "@influxdata/influxdb-client";
import { influxDB } from "./database";

interface QueryArgs {
  symbol: string;
  startingDate: Date;
  endingDate: Date;
  measurement?: string;
}

/**
 * Query measurements
 * @param param0
 */
export const queryMeasurement = async ({
  symbol,
  startingDate,
  endingDate,
  measurement = MarketDataMeasurement,
}: QueryArgs): Promise<MarketDataSchema[]> => {
  const queryApi = influxDB.getQueryApi(org);

  const fluxQuery = `from(bucket:"${bucket}") 
  |> range(start: ${startingDate.toISOString()}, stop: ${endingDate.toISOString()}) 
  |> filter(
            fn: (r) => 
                r._measurement == "${measurement}" and
                r.symbol == "${symbol}",
            onEmpty: "keep"
        )
   |> fill(value: 0.0)
   |> distinct()
  `;

  return new Promise((resolve, reject) => {
    const data: MarketDataSchema[] = [];

    const fluxObserver = {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);

        data.push({
          symbol: o.symbol,
          open: o.open,
          high: o.high,
          low: o.low,
          close: o.close,
          volume: o.volume,
          date: new Date(o._time),
        });
      },
      error(error) {
        console.error(error);
        console.log("\nFinished ERROR");
        reject(error);
      },
      complete() {
        console.log("\nFinished SUCCESS");
        resolve(data);
      },
    };

    queryApi.queryRows(fluxQuery, fluxObserver);
  });
};
