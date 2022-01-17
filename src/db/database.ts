// import { marketDataSchema } from "./marketdata.schema";
import { bucket, org, token, url } from "../config";

import { InfluxDB } from "@influxdata/influxdb-client";

export type GroupBy =
  | "10s"
  | "1m"
  | "5m"
  | "10m"
  | "30m"
  | "1h"
  | "6h"
  | "12h"
  | "1d"
  | "7d"
  | "30d"
  | "365d";

/**
 * Instantiate the InfluxDB client
 * with a configuration object.
 **/
const influxDB = new InfluxDB({ url, token });

/**
 * Create a write client from the getWriteApi method.
 * Provide your `org` and `bucket`.
 **/
const writeApi = influxDB.getWriteApi(org, bucket);

export default { influxDB, writeApi };
