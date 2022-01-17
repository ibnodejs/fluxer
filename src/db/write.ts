import { MarketDataMeasurement, MarketDataSchema } from "./marketdata.schema";
import { bucket, org } from "../config";

/**
 * Exports Write method, for any measurements
 */
import { Point } from "@influxdata/influxdb-client";
import { influxDB } from "./database";

/**
 * Method to write marketdata measurements
 * @param data
 * @returns
 */
export const writeMeasurement = async (
  data: MarketDataSchema[]
): Promise<Point[]> => {
  const writeApi = influxDB.getWriteApi(org, bucket);

  try {
    const points = data.map((pointx) =>
      new Point(MarketDataMeasurement)
        .tag("symbol", pointx.symbol)
        .floatField("open", pointx.open)
        .floatField("open", pointx.open)
        .floatField("low", pointx.low)
        .floatField("close", pointx.close)
    );

    writeApi.writePoints(points);

    await writeApi.close();

    return points;
  } catch (err) {
    throw err;
  }
};
