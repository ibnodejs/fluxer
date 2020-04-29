import express from 'express';
import influx from './db/database';
import bodyParser from 'body-parser';
import { MarketDataMeasurement } from './db/marketdata.schema';

const app: express.Application = express()

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.get('/v1/query', function (req, res) {
    influx.query('select * from exodus_table')
        .then(result => {
            res.json(result)
            res.end()
        })
})

app.post('/v1/insert', function (req, res) {
    influx.writePoints([
        {
            measurement: 'exodus_table',
            fields: {
                symbol: req.body.symbol,
                open: 1.1,
                high: 1.1,
                low: 1.1,
                close: 1.1,
                volume: 1
            }
        }
    ])
    res.end()
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