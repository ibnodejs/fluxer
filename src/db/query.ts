import { MarketDataMeasurement, MarketDataSchema } from "./marketdata.schema";
import { bucket, org } from "./config";

/**
 * Query for any measurements
 */
import { influxDB } from ".";
import { values } from "lodash";

interface QueryArgs {
  symbol: string;
  startDate: Date;
  endDate: Date;
  measurement?: string;
}

/**
 * Query measurements
 * @param QueryArgs
 */
export const queryMeasurement = async ({
  symbol,
  startDate,
  endDate,
  measurement = MarketDataMeasurement,
}: QueryArgs): Promise<MarketDataSchema[]> => {
  const queryApi = influxDB.getQueryApi(org);

  const fluxQuery = `
  from(bucket: "${bucket}")
  |> range(start: ${startDate.toISOString()}, stop: ${endDate.toISOString()})
  |> filter(fn: (r) => r["_measurement"] == "${measurement}")
  |> filter(fn: (r) => r["symbol"] == "${symbol.toLocaleUpperCase()}")
  |> group(columns: ["_time"])
  |> yield()
  `;

  return new Promise((resolve, reject) => {
    let table: { [x: string]: any } = {};

    const fluxObserver = {
      next(row: any, tableMeta: any) {
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
            symbol,
            date: new Date(time), // with date object
            [o._field]: o._value,
          };
        }
      },
      error(error: Error) {
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
