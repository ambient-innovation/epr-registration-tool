import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  InMemoryCacheConfig,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { createUploadLink } from 'apollo-upload-client'
import cookie from 'cookie'
import merge from 'deepmerge'
import { isEqual } from 'lodash'
import { useEffect, useMemo } from 'react'

import { DEFAULT_LOCALE } from '@/config/i18n'
import { handleError } from '@/utils/error.utils'
import { joinUrl } from '@/utils/url.utils'

import config from './config'

export const GRAPHQL_URI = joinUrl(config.API_URL, 'graphql/')
export const AUTH_URI = joinUrl(config.API_URL, 'csrf/')
export const APOLLO_STATE_PROP_NAME = '__APOLLO_CACHE__'
export const LOCAL_STORAGE_KEY_LOCALE = 'locale'

type ApolloClientType = ApolloClient<NormalizedCacheObject>

let apolloClient: undefined | ApolloClientType

export const cacheOptions: InMemoryCacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        // Use relay-style pagination for paginated queries.
        // Two results belong to be different lists,
        // if one of the keyArg variables changes
        // exampleField: relayStylePagination(['myKeyArg']),
      },
    },
  },
}

const getCsrfToken = async (): Promise<string> => {
  // pass CSRF token from cookie to request header or fetch one if not exist
  let csrfToken = cookie.parse(document.cookie).csrftoken
  if (!csrfToken) {
    await fetch(AUTH_URI, { credentials: 'include' })
    csrfToken = cookie.parse(document.cookie).csrftoken
  }
  return csrfToken
}

const authLink = setContext(async (_, { headers }) => {
  return {
    credentials: 'include',
    headers: {
      ...headers,
      'X-CSRFToken': await getCsrfToken(),
      'Accept-Language':
        localStorage.getItem(LOCAL_STORAGE_KEY_LOCALE) || DEFAULT_LOCALE,
    },
  }
})

const httpLink = new HttpLink({
  // absolute server url
  uri: GRAPHQL_URI,
})

const httpUploadLink = createUploadLink({
  // absolute server url
  uri: GRAPHQL_URI,
})

/**
 * A "middleware" that handles graphql errors:
 * - graphQLErrors --> report to sentry
 * - networkErrors --> log to console
 * */
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((error) => handleError(error))
  }
  if (networkError) {
    console.error(`[Network error]`, networkError)
  }
})

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    // Typing of `concat` and `apollo-upload-client` are incompatible
    // but it seems to work anyway.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    link: ApolloLink.from([authLink, errorLink, httpUploadLink]),
    cache: new InMemoryCache(cacheOptions),
  })
}

/**
 * This client will be used within the next.js data fetching methods, such as getServerSideProps.
 * The server does not store cookies like a browser, hence we need to pass them manually.
 * */
export const createApolloClientSsr = (): ApolloClientType => {
  return new ApolloClient({
    ssrMode: true,
    link: httpLink,
    cache: new InMemoryCache(cacheOptions),
  })
}

export const initializeApollo = (
  ssrCache: null | NormalizedCacheObject = null
): ApolloClientType => {
  // create an apollo client if no client is present
  // (which is always the case on the server side)
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (ssrCache) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(ssrCache, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') {
    return _apolloClient
  }
  // Create the Apollo Client once in the client
  if (!apolloClient) {
    apolloClient = _apolloClient
  }

  return _apolloClient
}

export const addApolloState = <T extends { props: Record<string, unknown> }>(
  client: ApolloClientType,
  pageProps: T
): T => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }
  return pageProps
}

/**
 * This hook initializes the apollo client, which is used to render the application tree.
 * On the server side, this client will not be used to execute any queries.
 * Instead, we use a cached state, which has previously been attached to the
 * page props by calling `addApolloState`.
 * On the client side, apollo will use this cache as an initial state, or will
 * merge the incoming server data with it's existing cache, e.g. on page transitions.
 * */
export const useApollo = (
  pageProps: Record<string, unknown>,
  locale: string
): ApolloClientType => {
  const initialState = pageProps[
    APOLLO_STATE_PROP_NAME
  ] as null | NormalizedCacheObject

  const client = useMemo(() => {
    return initializeApollo(initialState)
  }, [initialState])

  useEffect(() => {
    // --- update local storage + reset apollo store when language changes ---
    // get previously saved locale from local storage
    const previousLocale = localStorage.getItem(LOCAL_STORAGE_KEY_LOCALE)
    if (previousLocale !== locale) {
      // only override local storage something if locale has changed
      localStorage.setItem(LOCAL_STORAGE_KEY_LOCALE, locale)
      if (previousLocale) {
        // only reset store if locale has changed + locale was previously set
        // - previousLocale == null means the app is loaded the first time
        // - previousLocale == locale means the app is reloaded, but the stored
        //   language is already correct
        // in both cases no reset is needed
        client.resetStore()
      }
    }
  }, [locale, client])

  return client
}
