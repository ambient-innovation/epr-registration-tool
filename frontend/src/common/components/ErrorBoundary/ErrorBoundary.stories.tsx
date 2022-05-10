import React from 'react'

import { ErrorBoundary } from './ErrorBoundary'

export default {
  title: 'Error/ErrorBoundary',
}

interface StoryArgs {
  throwError: false
}

const FailingComponent = ({ throwError }: StoryArgs) => {
  if (throwError) {
    throw new Error('Error in inner component')
  }
  return (
    <p>
      Happy UI
      <br />
      Please use controls to throw an error
    </p>
  )
}

export const Default = ({ throwError }: StoryArgs): React.ReactElement => {
  return (
    <ErrorBoundary fallback={<p>This is the fallback ui in case of errors</p>}>
      <FailingComponent throwError={throwError} />
    </ErrorBoundary>
  )
}
Default.args = {
  throwError: false,
}
