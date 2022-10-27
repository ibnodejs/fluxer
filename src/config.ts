import "dotenv/config";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import os from "os";

const { env } = process;

// env
export const isDev = env.NODE_ENV !== "production";

export const HOSTNAME = os.hostname();

/***
 * server env
 */
export const PORT = +(env.PORT || 3009);
export const appName = env.APP_NAME || "fluxer";

/**
 * Influx config
 */
export const url = get(process.env, "INFLUX_URL", "");
export const token = get(process.env, "INFLUX_TOKEN", "");
export const org = get(process.env, "INFLUX_ORG", "");
export const bucket = get(process.env, "INFLUX_BUCKET", "dev");

// Sentry env
export const sentryDSN = get(process.env, "SENTRY_DSN", "");

// Providers

// Cache
export const CACHE_KEY = get(process.env, "CACHE_KEY", "");
export const isCache = !isEmpty(CACHE_KEY);
