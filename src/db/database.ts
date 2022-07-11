import { token, url } from "../config";

import { InfluxDB } from "@influxdata/influxdb-client";

/**
 * Instantiate the InfluxDB client
 * with a configuration object.
 **/
export const influxDB = new InfluxDB({ url, token, timeout: 10000 * 70 });
