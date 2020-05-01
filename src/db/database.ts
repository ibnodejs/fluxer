import * as Influx from 'influx';
import { marketDataSchema } from './marketdata.schema';
import { influxDbHost, databaseName } from '../config';

export type Range = '10s' | '1m' | '12h' | '1d' | '7d' | '30d' | '365d';
const influx = new Influx.InfluxDB({
    host: influxDbHost,
    database: databaseName,
    schema: [marketDataSchema]
})

export default influx;