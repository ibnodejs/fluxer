import "./sentry";

import { HOSTNAME, PORT, appName, bucket, org, token, url } from "./config";
import {
  MarketDataMeasurement,
  MarketDataSchema,
} from "./db/marketdata.schema";
import { RoadmanBuild, log, roadman } from "roadman";

import FluxerResolver from "./gql/fluxer.resolver";
import { Router } from "express";
import { influxDB } from "./db/database";
import isEmpty from "lodash/isEmpty";
import { queryMeasurement } from "./db/query";
import { writeMeasurement } from "./db/write";

export const fluxerRoadman = async (
  args: RoadmanBuild
): Promise<RoadmanBuild> => {
  const { app } = args;
  // if no token, url do not enable influxDB
  if (!token) {
    log("fluxerRoadman cannot be enabled");
  } else {
    log("fluxerRoadman is enabled");

    if (app) {
      app.use("/fluxer", fluxerHttpQuery());
    }
  }
  return args;
};

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

  return router;
};

export async function runApp(): Promise<boolean> {
  try {
    const running = await roadman({
      roadmen: [fluxerRoadman],
      resolvers: [FluxerResolver],
    });

    if (!running) {
      throw new Error("Error running app");
    }

    log(`Started ${appName} on ${PORT}`);
    log("started server with bucket", { bucket, org, url });

    return true;
  } catch (error) {
    log("error running app", error);
    console.error(error);
    process.exit(1);
  }
}
