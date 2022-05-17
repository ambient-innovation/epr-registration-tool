import { captureException } from '@sentry/react'
import { NextPage, NextPageContext } from 'next'
import NextErrorComponent from 'next/error'

import { ErrorPage } from '@/common/components/ErrorBoundary'

export interface ErrorPageProps {
  statusCode?: number
  hasGetInitialPropsRun?: boolean
  // This err is passed via `_app.tsx` (see below)
  err?: unknown
}

// eslint-disable-next-line react/prop-types
const MyError: NextPage<ErrorPageProps> = ({ statusCode, err }) => {
  /* --- begin workaround---

  - Expected behaviour:
    Since `getInitialProps` is only called on the server-side
    `statusCode` will be undefined if an error occurred on client side
    (docs: https://nextjs.org/docs/advanced-features/custom-error-page#customizing-the-error-page)
  - But:
    In some cases `getInitialProps` isn't called, even though an error
    occurred on server (https://github.com/vercel/next.js/issues/8592).
    In these cases the error has not yet been reported to Sentry.
  - Workaround:
    We pass the error in `_app.tsx` and record it here in case
    `getInitialProps` has not been called.
    Note: If this workaround should become obsolete in the future,
    please update `_app.tsx`, too.
  */
  const receivedInitialProps = statusCode === undefined
  if (!receivedInitialProps && err) {
    console.warn(
      'Sentry: Reported error, which has not been captured in `getInitialProps`',
      err
    )
    captureException(err)
  }

  const title = statusCode ? `${statusCode}` : 'Unknown Error'

  return <ErrorPage title={title} />
}

MyError.getInitialProps = async (props: NextPageContext) => {
  const { err, res, asPath } = props
  let { statusCode } = await NextErrorComponent.getInitialProps(props)

  /* Handle apollo errors that are due to a csrf failure.
  This might happen if the browser sends an invalid csrf cookie,
  which is directly passed to the backend during a graphql call.
  This will result in a 404 response from the server.
  In this case:
    - we remove the csrf cookie
    - we set the response status to 403 */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (res && err?.networkError?.statusCode === 403) {
    statusCode = 403
  }

  // ---- Record Error ---- //
  if (statusCode === 404) {
    // do not record an exception in Sentry for 404
    // I think a 404 would never reach this point, since we have the
    // `pages/404.tsx` in place, but just in case...
  } else {
    const reportErr =
      err ||
      // If err is not defined, getInitialProps was called without any
      // information about what the error might be. This is unexpected and may
      // indicate a bug introduced in Next.js, so record it in Sentry
      new Error(`_error.js getInitialProps missing data at path: ${asPath}`)
    captureException(reportErr)
  }

  // Provide status code to `MyError`
  return { statusCode }
}

export default MyError
