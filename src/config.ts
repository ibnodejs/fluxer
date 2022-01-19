import { get } from "lodash";
import os from "os";
require("dotenv").config();

const { env } = process;

// env
export const isDev = env.NODE_ENV !== "production";

export const HOSTNAME = os.hostname();

/***
 * server env
 */
export const PORT = +(env.PORT || 3009);
export const appName = env.APP_NAME || "FLUXER";

/**
 * Influx config
 */
export const demoInsert = env.DEMO_INSERT;

export const url = process.env.INFLUX_URL || "";
export const token = process.env.INFLUX_TOKEN;
export const org = process.env.INFLUX_ORG || "";
export const bucket = process.env.INFLUX_BUCKET || "dev";

export const sentryDSN = get(process.env, "SENTRY_DSN", "");
