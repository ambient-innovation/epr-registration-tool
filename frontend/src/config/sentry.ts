import { init, configureScope } from '@sentry/react'

import config from './config'

const {
  SENTRY_ENVIRONMENT: environment,
  SENTRY_DSN: dsn,
  SENTRY_RELEASE: release,
} = config

export const initSentry = (): void => {
  if (!dsn) {
    console.info(
      'Sentry reporting disabled; set REACT_APP_SENTRY_DSN to enable'
    )
    return
  }

  init({ dsn, environment, release })

  // set "ssr" tag, which indicates, whether an error
  // occurred in the browser or during ssr
  configureScope((scope) => {
    scope.setTag('ssr', typeof window === 'undefined')
  })
}
