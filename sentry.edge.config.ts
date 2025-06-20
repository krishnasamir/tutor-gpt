// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const SENTRY_ENVIRONMENT = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;

Sentry.init({
  dsn: SENTRY_DSN,

  ignoreErrors: [
    /Hydration failed/,
    /server rendered HTML didn't match the client/,
  ],
  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: SENTRY_ENVIRONMENT === "production" ? 0.3 : 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
