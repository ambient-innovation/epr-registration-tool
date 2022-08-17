import { ApolloProvider } from '@apollo/client'
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { UserProvider } from '@/auth/hooks/useUser'
import { useApollo } from '@/config/apolloClient'
import { DEFAULT_LOCALE } from '@/config/i18n'
import { initSentry } from '@/config/sentry'
import { theme, EmotionCacheProvider } from '@/theme'
import { notoSansFontCss } from '@/theme/fontsCss'

// Initialize Sentry
initSentry()

function MyApp({ Component, pageProps }: AppProps) {
  const { locale } = useRouter()
  const apolloClient = useApollo(pageProps, locale || DEFAULT_LOCALE)

  useEffect(() => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.setAttribute('dir', dir)
    document.body.dir = dir
  }, [locale])

  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <EmotionCacheProvider>
          <Head>
            <meta
              name={'viewport'}
              content={'minimum-scale=1, initial-scale=1, width=device-width'}
            />
          </Head>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <GlobalStyles styles={notoSansFontCss} />
            <Component {...pageProps} />
          </ThemeProvider>
        </EmotionCacheProvider>
      </UserProvider>
    </ApolloProvider>
  )
}

export default appWithTranslation(MyApp)
