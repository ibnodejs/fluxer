import "./sentry";

import { PORT, appName, bucket, org, url } from "./config";
import { log, roadman } from "roadman";

import FluxerResolver from "./db/fluxer.resolver";
import { fluxerRoadman } from "./db";

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

runApp();
