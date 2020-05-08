import * as Sentry from '@sentry/node';
import { isDev } from './config';

Sentry.init({
    dsn: process.env.SENTRY_DSN || 'https://ed3624d2ad6846d484a37ad699c25ed1@o380201.ingest.sentry.io/5227706',
    enabled: !isDev
});