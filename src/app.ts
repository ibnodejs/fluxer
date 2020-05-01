import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import nanoexpress from 'nanoexpress';
import Nano from 'nano-date'

import influx from './db/database';
import { MarketDataMeasurement } from './db/marketdata.schema';

import { PORT, databaseName, appName, HOSTNAME } from './config';
// const app: express.Application = express()

const app = nanoexpress();

app.get('/', function (req, res) {

    res.json({
        hostname: HOSTNAME,
        date: new Date
    })

    console.log('health check')
})

app.get('/v1/query', async function async(req, res) {

    const { symbol = "AAPL", startDate, endDate, range } = req.params;
    const curDate = new Date();
    const cloneDate = new Date(curDate);

    const startingDate = new Nano((new Date(cloneDate.setDate(cloneDate.getDate() - 1)))).full;
    const endingDate = new Nano(curDate).full;

    console.log('dates are', { startingDate, endingDate })
    const query = `
    SELECT mean("close") AS "mean_close", mean("high") AS "mean_high", mean("low") AS "mean_low", mean("volume") AS "mean_volume", mean("open") AS "mean_open" 
    FROM "exodus"."autogen"."market" 
    WHERE time > ${startingDate} AND time < ${endingDate} 
    AND "symbol"='${symbol}' GROUP BY time(1m)`;

    let data = [];
    try {
        data = await influx.query(query)
    }
    catch (error) {
        console.log('error getting candles', error);
    }
    finally {
        return res.json(data);
    }

})

app.post('/v1/insert', function (req, res) {

    const data = req && req.body;

    const defaultTimestamp = new Date().getTime();

    const items: any = [];

    if (Array.isArray(data)) {
        data.map(item => {
            const { symbol = "UNKNOWN", open = 0, high = 0, low = 0, close = 0, volume = 0, date = defaultTimestamp } = item as any;
            items.push(
                {
                    measurement: MarketDataMeasurement,
                    fields: {
                        open, high, low, close, volume
                    },
                    tags: {
                        symbol
                    },
                    timestamp: new Date(date).getTime()
                }
            )
        })
    } else {
        const item = data as any;
        const { symbol = "UNKNOWN", open = 0, high = 0, low = 0, close = 0, volume = 0, date = defaultTimestamp } = item;

        if (item && item.symbol) {
            items.push(
                {
                    measurement: MarketDataMeasurement,
                    fields: {
                        open, high, low, close, volume
                    },
                    tags: {
                        symbol
                    },
                    timestamp: new Date(date).getTime()
                }
            )
        }

    }

    if (!isEmpty(items)) {
        res.json({ status: 200 })
        return influx.writePoints(items)
    }

    res.status(401);
    res.end();

})

export async function runApp(): Promise<boolean> {
    try {

        let count = 0;
        const names = await influx.getDatabaseNames();
        if (!names.includes(databaseName)) {
            await influx.createDatabase(databaseName)
        }
        await app.listen(PORT);

        console.log(`Started ${appName} on ${PORT}`);

        // return true;
        // setInterval(() => {
        //     influx.writePoints([
        //         {
        //             measurement: MarketDataMeasurement,
        //             fields: {
        //                 // symbol: "AAPL",
        //                 open: 1.1,
        //                 high: 1.1,
        //                 low: 1.1,
        //                 close: count += 1,
        //                 volume: 1
        //             },
        //             // timestamp: new Date().getTime(),
        //             tags: {
        //                 symbol: 'AAPL'
        //             }

        //         }
        //     ])/*  */
        //     console.log('add values', count)
        // }, 500);

        return true;

    }
    catch (error) {
        console.log('error running app', error && error.message);
        console.error(error)
        process.exit(1);
    }
}