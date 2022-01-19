import * as Sentry from "@sentry/node";

import { isDev, sentryDSN } from "./config";

import { isEmpty } from "lodash";

if (!isEmpty(sentryDSN)) {
  Sentry.init({
    dsn: sentryDSN,
    enabled: !isDev,
  });
}
