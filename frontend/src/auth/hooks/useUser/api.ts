import axios, {
  AxiosRequestConfig,
  AxiosRequestTransformer,
  AxiosResponse,
} from 'axios'
import camelcaseKeys from 'camelcase-keys'
import cookie from 'cookie'

import { CsrfResponse, LoginResponseData } from './api.types'

const authApiUrl = process.env.NEXT_PUBLIC_API_URL + 'api/v1/auth'

export const makeUrl = (authPath: string, suffix: string): string => {
  const separator = authPath.endsWith('/') ? '' : '/'

  return `${authPath}${separator}${suffix}`
}

const axiosConfig: AxiosRequestConfig = {
  // pass cookies
  withCredentials: true,
  baseURL: authApiUrl,
  transformRequest: [
    (data, headers) => {
      // pass csrf token from cookie
      if (headers) {
        headers['X-CSRFToken'] = cookie.parse(document.cookie).csrftoken
      }
      return data
    },
    ...(axios.defaults.transformRequest as AxiosRequestTransformer[]),
  ],
}

const camelCaseError = <D>(
  apiCall: Promise<AxiosResponse<D>>
): Promise<AxiosResponse<D>> =>
  apiCall.catch((error) => {
    if ('response' in error) {
      throw {
        ...error,
        response: {
          ...error.response,
          data: camelcaseKeys(error.response.data),
        },
      }
    }
    throw error
  })

export const loginAPI = (
  ident: string,
  password: string,
  rememberMe: boolean
): Promise<LoginResponseData> =>
  camelCaseError(
    axios.post<LoginResponseData>(
      makeUrl(authApiUrl, 'login/'),
      { ident, password, rememberMe },
      axiosConfig
    )
  ).then(({ data }) => data)

export const logoutAPI = (): Promise<unknown> =>
  camelCaseError(
    axios.post<CsrfResponse>(makeUrl(authApiUrl, 'logout/'), {}, axiosConfig)
  ).then(({ data }) => camelcaseKeys(data))

export const activateEmailAddressAPI = (
  ident: string,
  token: string
): Promise<unknown> =>
  axios.post(
    makeUrl(authApiUrl, 'activate_email/'),
    { ident, token },
    axiosConfig
  )
