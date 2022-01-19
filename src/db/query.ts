import { MarketDataMeasurement, MarketDataSchema } from "./marketdata.schema";
import { bucket, org } from "../config";

/**
 * Query for any measurements
 */
import { Point } from "@influxdata/influxdb-client";
import { influxDB } from "./database";
import { values } from "lodash";

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

  const fluxQuery = `
  from(bucket: "${bucket}")
  |> range(start: ${startingDate.toISOString()}, stop: ${endingDate.toISOString()})
  |> filter(fn: (r) => r["_measurement"] == "${measurement}")
  |> filter(fn: (r) => r["symbol"] == "${symbol}")
  |> group(columns: ["_time"])
  |> yield()
  `;

  return new Promise((resolve, reject) => {
    let table: { [x: string]: any } = {};

    const fluxObserver = {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        const time = o._time;
        if (table[time]) {
          // exists, just append
          table[time] = {
            ...table[time],
            [o._field]: o._value,
          };
        } else {
          // create a new table
          table[time] = {
            date: new Date(time), // with date object
            [o._field]: o._value,
          };
        }
      },
      error(error) {
        console.error(error);
        reject(error);
      },
      complete() {
        resolve(values(table));
      },
    };

    queryApi.queryRows(fluxQuery, fluxObserver);
  });
};
