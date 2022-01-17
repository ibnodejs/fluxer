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
}: QueryArgs): Promise<MarketDataSchema[] | void> => {
  const queryApi = influxDB.getQueryApi(org);

  /**
   Old query
   const query = `
    SELECT time AS date, mean("close") AS "close", mean("high") AS "high", mean("low") AS "low", mean("volume") AS "volume", mean("open") AS "open" 
    FROM "${databaseName}"."autogen"."market" 
    WHERE time > ${startingDate} AND time < ${endingDate} AND close != 0
    AND "symbol"='${symbol}' ${
    range ? `GROUP BY time(${range})` : "GROUP BY TIME(1m)"
  } ${fill ? `fill(${fill})` : `fill(none)`} `;

   */
  const fluxQuery = `from(bucket:"${bucket}") 
  |> range(start: ${startingDate}, stop: ${endingDate}) 
  |> filter(
            fn: (r) => 
                r._measurement == "${measurement}" and
                r.symbol == "${symbol}",
            onEmpty: "keep"
        )
   |> fill(value: 0.0)
   |> distinct()
  `;

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
      throw error;
    },
    complete() {
      console.log("\nFinished SUCCESS");
      Promise.resolve(data);
    },
  };

  /** Execute a query and receive line table metadata and rows. */
  queryApi.queryRows(fluxQuery, fluxObserver);
};
