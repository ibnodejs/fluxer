import "dotenv/config";

import get from "lodash/get";

export const url = get(process.env, "INFLUX_URL", "");
export const token = get(process.env, "INFLUX_TOKEN", "");
export const org = get(process.env, "INFLUX_ORG", "");
export const bucket = get(process.env, "INFLUX_BUCKET", "dev");
