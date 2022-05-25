import { ApolloError } from '@apollo/client'
import { TFunction } from 'i18next'
import { useTranslation } from 'next-i18next'

import { ErrorAlert } from '@/common/components/ErrorAlert'

export type ErrorMessagesMap = Partial<Record<string, string>>

export interface ApolloErrorAlert extends Omit<ErrorAlert, 'children'> {
  error: ApolloError
  autoFocusError?: boolean
}

export const getApolloErrorMessage = (
  error: ApolloError,
  t: TFunction
): string => {
  if (error.networkError) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (error.networkError.statusCode === 403) {
      return t('common:serverErrors.permissionDenied')
    } else {
      return t('common:serverErrors.genericNetworkError')
    }
  } else if (error.graphQLErrors) {
    const messagesArray: string[] = []
    error.graphQLErrors.forEach((e) => {
      const errorCode = (e.extensions?.code || e.message) as string
      const errorMessage = t([
        `common:serverErrors.${errorCode}`,
        'common:serverErrors.unknownError',
      ])
      if (!!errorMessage && messagesArray.indexOf(errorMessage) === -1) {
        messagesArray.push(errorMessage)
      }
    })

    return messagesArray.join(', ')
  } else {
    return t('common:serverErrors.unknownError')
  }
}

export const ApolloErrorAlert = ({
  error,
  ...errorMessageProps
}: ApolloErrorAlert): React.ReactElement | null => {
  const { t } = useTranslation()
  const errorMessage = getApolloErrorMessage(error, t)
  return <ErrorAlert {...errorMessageProps}>{errorMessage}</ErrorAlert>
}
