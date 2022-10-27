import { MarketDataMeasurement, MarketDataSchema } from "./marketdata.schema";
import { bucket, org } from "./config";

/**
 * Exports Write method, for any measurements
 */
import { Point } from "@influxdata/influxdb-client";
import { influxDB } from ".";
import { log } from "@roadmanjs/logs";

/**
 * Method to write marketdata measurements
 * @param data
 * @returns
 */
export const writeMeasurement = async (
  data: MarketDataSchema[]
): Promise<Point[] | null> => {
  const writeApi = influxDB.getWriteApi(org, bucket);

  try {
    const points = data.map((pointx) =>
      new Point(MarketDataMeasurement)
        .tag("symbol", pointx.symbol)
        .floatField("open", pointx.open)
        .floatField("close", pointx.close)
        .floatField("high", pointx.high)
        .floatField("low", pointx.low)
        .floatField("volume", pointx.volume)
        .timestamp(new Date(pointx.date))
    );

    writeApi.writePoints(points);

    await writeApi.close();

    log(`FLUXER:WRITE ${data[0].symbol} -> ${points.length}`);

    return points;
  } catch (err) {
    console.error(err);
    return null;
    // throw err;
  }
};
