import os from 'os';
require('dotenv').config();

const { env } = process;

// Envs
export const isDev = env.NODE_ENV !== 'production';

export const HOSTNAME = os.hostname();

/***
 * Algo server env
 */
export const PORT = +(env.PORT || 3009);
export const appName = env.APP_NAME || 'EXODUS';

/**
 * Influx config
 */
export const databaseName = env.APP_DB || 'stoqey';
export const influxDbHost: string = (env.INFLUX_HOST || 'localhost');
export const demoInsert = env.DEMO_INSERT;
