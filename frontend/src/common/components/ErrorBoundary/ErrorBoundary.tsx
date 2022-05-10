import { captureException } from '@sentry/react'
import React, { Component, ErrorInfo } from 'react'

export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback: React.ReactNode
}

export interface ErrorBoundaryState {
  hasError: boolean
  error: null | Error
  info: null | ErrorInfo
  eventId: null | string
  componentStack: null | string
}

const INITIAL_STATE: ErrorBoundaryState = {
  hasError: false,
  error: null,
  info: null,
  eventId: null,
  componentStack: null,
}

/**
 * Generic React Error Boundary
 * Docs: https://reactjs.org/docs/error-boundaries.html
 *
 * This component is heavily inspired by `Sentry.ErrorBoundary`:
 * `storefront/node_modules/@sentry/react/dist/errorboundary.js`
 * We cannot use this component directly, since we need to support
 * `@sentry/node` for ssr (see `next.config.js` for more details)
 *
 * This Error Boundary does nothing but caching any kind of error,
 * reporting it to Sentry and displaying a given fallback UI.
 *
 * Please see related components which provide actual fallback UIs,
 * such as `<ErrorDisplay>` and `<ErrorPage>`.
 * */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = INITIAL_STATE
  }

  public static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught an error', error, info)
    const componentStack = info.componentStack
    captureException(error, {
      contexts: { react: { componentStack: componentStack } },
    })
    captureException(error)

    // // possible extension for the future:
    // // --> pass `error`, `info`, `eventId` + a `reset` function to the fallback UI
    // this.setState({
    //   error: error,
    //   componentStack: componentStack,
    //   eventId: eventId, // return value of `componentStack`
    // });
  }

  public render(): React.ReactNode {
    const { children, fallback } = this.props
    const { hasError } = this.state

    if (hasError) {
      // possible extension for the future:
      // pass `error`, `info`, `eventId` + a `reset` function
      return fallback
    }

    return children
  }
}
