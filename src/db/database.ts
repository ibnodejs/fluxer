import * as Influx from 'influx';
import { marketDataSchema } from './marketdata.schema';
import { influxDbHost, influxDbPort, databaseName } from '../config';

export type GroupBy = '10s' | '1m' | '5m' | '10m' | '30m' | '1h' | '6h' | '12h' | '1d' | '7d' | '30d' | '365d';

const influx = new Influx.InfluxDB({
    port: influxDbPort,
    host: influxDbHost,
    database: databaseName,
    schema: [marketDataSchema]
})

export default influx;