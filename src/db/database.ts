import * as Influx from 'influx';
import { marketDataSchema } from './marketdata.schema';
import { influxDbHost, databaseName } from '../config';

const influx = new Influx.InfluxDB({
    host: influxDbHost,
    database: databaseName,
    schema: [marketDataSchema]
})

export default influx;