import { AxiosError } from 'axios'
import { TFunction } from 'i18next'

import { handleError } from '@/utils/error.utils'

export const getAxiosErrorMessage = <T>(
  error: AxiosError<T>,
  getTransKey: (data: T) => undefined | string,
  t: TFunction
): string => {
  if (error.code === AxiosError.ERR_NETWORK) {
    // case 1: network error
    return t('serverErrors.genericNetworkError')
  } else if (error.response && error.response.status === 403) {
    // case 2: permission denied
    return t('serverErrors.generic403')
  } else if (error.response) {
    // case 3: error response
    const transKey = getTransKey(error.response.data)
    return transKey
      ? t(transKey, t('serverErrors.unknownError'))
      : t('serverErrors.unknownError')
  } else {
    // case 3: unknown error
    if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      return t('serverErrors.unknownError')
    } else {
      // Something happened in setting up the request that triggered an Error
      return t('internalErrors.unknownError')
    }
  }
}

export const handleAxiosError = <T>(error: AxiosError<T>) => {
  if (
    error.code !== AxiosError.ERR_BAD_REQUEST &&
    error.code !== AxiosError.ERR_NETWORK
  ) {
    // case 3: unknown error
    handleError(error)
  }
}
