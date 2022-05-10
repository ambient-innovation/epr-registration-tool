const config = {
  // `|| ''` --> make type is `string` instead of `string | undefined`
  API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || '',

  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  SENTRY_ENVIRONMENT: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
  SENTRY_RELEASE: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
}

export default config
