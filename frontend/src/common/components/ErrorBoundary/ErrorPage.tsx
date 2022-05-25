import React from 'react'

import { ErrorBoundary } from './ErrorBoundary'

export interface ErrorPage {
  title: string
}

// we use simple style to minmize the error Page dependencies
const tempStyle = {
  minHeight: '60vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 1.5rem',
}

/**
 * Renders an error message wrapped in the `MainLayout` component
 * --> falls back to the error message without `MainLayout`
 * in case the error was caused by `MainLayout`
 * */
export const ErrorPage = ({ title }: ErrorPage): React.ReactElement => {
  const content = (
    <div style={tempStyle}>
      <h1>{title}</h1>
    </div>
  )
  return <ErrorBoundary fallback={content}>{content}</ErrorBoundary>
}
