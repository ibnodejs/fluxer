const Influx = require('influx')

const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'exodus',
    schema: [
        {
            measurement: 'exodus_table',
            fields: {
                symbol: Influx.FieldType.STRING,
                date: Influx.FieldType.DATE,
                open: Influx.FieldType.FLOAT,
                high: Influx.FieldType.FLOAT,
                low: Influx.FieldType.FLOAT,
                close: Influx.FieldType.FLOAT,
                volume: Influx.FieldType.INTEGER
            },
            tags: [
                'host'
            ]
        }
    ]
})

export default influx