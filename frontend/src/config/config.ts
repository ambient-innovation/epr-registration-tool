const config = {
  // we use BACKEND_URL for our docker setup. A docker container does not know
  // localhost as it is running in its own network. Therefor if we want to
  // communicate internally between containers (server side) we need to use
  // BACKEND_URL set to the docker-compose service name, in our case `backend`
  // we need this only in e2e and local development environments.
  // https://stackoverflow.com/a/64030045
  //
  // `|| ''` --> make type is `string` instead of `string | undefined`
  API_URL: process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || '',
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || '',

  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  SENTRY_ENVIRONMENT: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
  SENTRY_RELEASE: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  PREVIEW_SECRET: process.env.PREVIEW_SECRET,
}

export default config
