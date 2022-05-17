import { captureException } from '@sentry/node'

export const handleError = (error: unknown): void => {
  captureException(error)
  console.error('Captured exception: ', error)
}
