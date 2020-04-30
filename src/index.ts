import express from 'express';
import influx from './db/database';
import bodyParser from 'body-parser';
import { MarketDataMeasurement } from './db/marketdata.schema';
import nanoexpress from 'nanoexpress';
// const app: express.Application = express()

const app = nanoexpress();

app.get('/v1/query', function (req, res) {
    influx.query('select * from exodus_table')
        .then(result => {
            res.json(result)
            res.end()
        })
})

app.post('/v1/insert', function (req, res) {
    // TODO Insert object or array
    const { symbol = "UNKNOWN", open = 0, high = 0, low = 0, close = 0, volume = 0 } = req.body as any;

    res.end();
    influx.writePoints([
        {
            measurement: MarketDataMeasurement,
            fields: {
                symbol, open, high, low, close, volume
            },
            tags: {
                symbol
            }
        }
    ])

})

influx.getDatabaseNames()
    .then(names => {
        if (!names.includes('exodus')) {
            return influx.createDatabase('exodus')
        }
    })
    .then(() => {
        app.listen(3000, function () {
            console.log('Listening on port 3000');

            let count = 0;

            setInterval(() => {
                influx.writePoints([
                    {
                        measurement: MarketDataMeasurement,
                        fields: {
                            // symbol: "AAPL",
                            open: 1.1,
                            high: 1.1,
                            low: 1.1,
                            close: count += 1,
                            volume: 1
                        },
                        tags: {
                            symbol: 'AAPL'
                        }

                    }
                ])/*  */
                console.log('add values', count)
            }, 500);

        })
    })
    .catch(err => {
        console.error(err)
        console.error('Error creating Influx database!')
    })