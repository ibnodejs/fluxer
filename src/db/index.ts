import "reflect-metadata";

import { token, url } from "./config";

import FluxerResolver from "./fluxer.resolver";
import { HOSTNAME } from "src/config";
import { InfluxDB } from "@influxdata/influxdb-client";
import { MarketDataSchema } from "./marketdata.schema";
import { RoadmanBuild } from "roadman";
import { Router } from "express";
import isEmpty from "lodash/isEmpty";
import { log } from "@roadmanjs/logs";
import { queryMeasurement } from "./query";
import { writeMeasurement } from "./write";

export let influxDB: InfluxDB;

export const fluxerHttpQuery = () => {
  const router = Router();

  router.get("/", function (req, res) {
    res.json({
      hostname: HOSTNAME,
      date: new Date(),
    });

    log("health check");
  });

  router.post("/", async function async(req, res) {
    const {
      symbol = "AAPL",
      start: startDateOg = new Date(),
      end,
    } = (req.query || {}) as any;

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
      data = await queryMeasurement({
        symbol,
        startDate: startingDate,
        endDate: endingDate,
      });
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

  // @deprecated
  router.post("/insert", async function (req, res) {
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

      throw new Error("items are empty");
    } catch (error) {
      log("error inserting items into influxDB", error);
      res.status(401);
      res.end();
    }
  });

  return router;
};

export const fluxerRoadman = async (
  args: RoadmanBuild
): Promise<RoadmanBuild> => {
  const { app } = args;
  // if no token, url do not enable influxDB
  if (!token) {
    log("fluxerRoadman cannot be enabled");
  } else {
    log("fluxerRoadman is enabled");
    influxDB = new InfluxDB({ url, token, timeout: 10000 * 70 });

    if (app) {
      app.use("/fluxer", fluxerHttpQuery());
    }
  }
  return args;
};

export const getFluxerResolvers = () => [FluxerResolver];
