import * as Influx from 'influx';
import { marketDataSchema } from './marketdata.schema';

// TODO init from config
const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'exodus',
    schema: [marketDataSchema]
})

export default influx;