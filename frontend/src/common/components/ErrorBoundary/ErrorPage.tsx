import { css } from '@emotion/react'
import React from 'react'

import { ErrorBoundary } from './ErrorBoundary'

export interface ErrorPage {
  title: string
}

const tempCss = css`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
`

/**
 * Renders an error message wrapped in the `MainLayout` component
 * --> falls back to the error message without `MainLayout`
 * in case the error was caused by `MainLayout`
 * */
export const ErrorPage = ({ title }: ErrorPage): React.ReactElement => {
  const content = (
    <div css={tempCss}>
      <h1>{title}</h1>
    </div>
  )
  return <ErrorBoundary fallback={content}>{content}</ErrorBoundary>
}
