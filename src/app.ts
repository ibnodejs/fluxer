import "./sentry";

import { HOSTNAME, PORT, appName } from "./config";
import {
  MarketDataMeasurement,
  MarketDataSchema,
} from "./db/marketdata.schema";

import isEmpty from "lodash/isEmpty";
import { log } from "./log";
import nanoexpress from "nanoexpress";
import { queryMeasurement } from "./db/query";
import { writeMeasurement } from "./db/write";

const app = nanoexpress();

app.get("/", function (req, res) {
  res.json({
    hostname: HOSTNAME,
    date: new Date(),
  });

  log("health check");
});

interface QueryMdata {
  symbol: string;
  start: Date;
  end: Date;
}

app.get("/v1/query", async function async(req, res) {
  const {
    symbol = "AAPL",
    start: startDateOg = new Date(),
    end,
  }: QueryMdata = (req.query || {}) as any;

  log("query", req.query);
  const startDate = new Date(startDateOg);

  const { startingDate, endingDate } = (() => {
    // if we have endDate
    if (end) {
      return {
        endingDate: new Date(end),
        startingDate: new Date(startDate),
      };
    }

    // Else clone startDate, go back a day in the past and set as endingDate
    const cloneStartDate = new Date(startDate);
    let startingDate = new Date(
      cloneStartDate.setDate(cloneStartDate.getDate() - 1)
    );
    let endingDate = startDate;

    return {
      endingDate,
      startingDate,
    };
  })();

  log("dates are", { startingDate, endingDate });

  let data: MarketDataSchema[] = [];
  try {
    data = await queryMeasurement({ symbol, startingDate, endingDate });
    log("data response is", data && data.length);
    if (isEmpty(data)) {
      throw new Error("Error market data null");
    }
  } catch (error) {
    log("error getting candles", error);
  } finally {
    return res.json(data);
  }
});

app.post("/v1/insert", async function (req, res) {
  const data = req && req.body;
  const defaultTimestamp = new Date();
  const items: MarketDataSchema[] = [];

  try {
    // If is array
    if (Array.isArray(data)) {
      data.map((item) => {
        // Init with defaults
        const {
          symbol = "UNKNOWN",
          open = 0,
          high = 0,
          low = 0,
          close = 0,
          volume = 0,
          date = defaultTimestamp,
        } = item as MarketDataSchema;

        items.push({
          open,
          high,
          low,
          close,
          volume,
          symbol,
          date: new Date(date),
        });
      });
    } else {
      // Single object
      const item = data as any;
      const {
        symbol = "UNKNOWN",
        open = 0,
        high = 0,
        low = 0,
        close = 0,
        volume = 0,
        date = defaultTimestamp,
      } = item;

      if (item && item.symbol) {
        items.push({
          open,
          high,
          low,
          close,
          volume,
          symbol,
          date: new Date(date),
        });
      }
    }

    if (!isEmpty(items)) {
      res.json({ status: 200 }); // non blocking
      await writeMeasurement(items);
      return log(`${JSON.stringify(items[0])} ---> `, items.length);
    }

    res.status(401);
    res.end();
  } catch (error) {
    log("error inserting items into influxDB", error);
    res.status(401);
    res.end();
  }
});

export async function runApp(): Promise<boolean> {
  try {
    await app.listen(PORT);
    log(`Started ${appName} on ${PORT}`);
    return true;
  } catch (error) {
    log("error running app", error);
    console.error(error);
    process.exit(1);
  }
}
