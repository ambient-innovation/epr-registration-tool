import { Alert, AlertTitle, AlertProps } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { useEffect, useRef } from 'react'

import { defaultFocusSx } from '@/theme/utils'

export type ErrorAlert = Omit<AlertProps, 'children' | 'severity'> & {
  id?: string
  title?: string
  // "autoFocus" is a reserved attribute --> "shouldAutoFocus"
  shouldAutoFocus?: boolean
  children: React.ReactElement | string
}

export const ErrorAlert = ({
  children,
  shouldAutoFocus = true,
  title,
  ...props
}: ErrorAlert & { children: string | number }): React.ReactElement => {
  const ref = useRef<HTMLDivElement>(null)

  const { t } = useTranslation()

  useEffect(() => {
    if (shouldAutoFocus && ref.current) {
      ref.current.focus()
    }
  }, [shouldAutoFocus])

  return (
    <Alert
      severity={'error'}
      tabIndex={-1}
      ref={ref}
      sx={defaultFocusSx}
      {...props}
    >
      <AlertTitle>
        {title || t('common:somethingUnexpectedHappened')}
      </AlertTitle>
      {children}
    </Alert>
  )
}
