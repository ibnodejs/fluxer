import "reflect-metadata";

import { token, url } from "./config";

import FluxerResolver from "./fluxer.resolver";
import { InfluxDB } from "@influxdata/influxdb-client";
import { MarketDataSchema } from "./marketdata.schema";
import { RoadmanBuild } from "roadman";
import { Router } from "express";
import isEmpty from "lodash/isEmpty";
import { log } from "@roadmanjs/logs";
import { queryMeasurement } from "./query";

export let influxDB: InfluxDB;

export const fluxerRoadman = (args: RoadmanBuild): RoadmanBuild => {
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

export const fluxerHttpQuery = () => {
  const router = Router();
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

  return router;
};

export const getFluxerResolvers = () => [FluxerResolver];
