import createEmotionServer from '@emotion/server/create-instance'
import Document, { Html, Head, Main, NextScript } from 'next/document'

import { DEFAULT_LOCALE } from '@/config/i18n'
import { theme } from '@/theme'
import { createEmotionCache } from '@/theme'

export default class MyDocument extends Document {
  render() {
    const { locale } = this.props
    return (
      // lang will be provided by nextjs
      <Html dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <Head>
          {/* PWA primary color */}
          <meta name={'theme-color'} content={theme.palette.primary.main} />
          <link rel={'shortcut icon'} href={'/favicon.ico'} />
          <meta
            name={'msapplication-navbutton-color'}
            content={theme.palette.primary.light}
          />
          <meta
            name={'apple-mobile-web-app-status-bar-style'}
            content={theme.palette.primary.light}
          />
          {/* Inject MUI styles first to match with the prepend: true configuration. */}
          {/*eslint-disable-next-line react/no-danger*/}
          {(this.props as any).emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage
  const locale = ctx?.locale || DEFAULT_LOCALE
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  // const cache = isRtlLocal ? createRtlEmotionCache() : createEmotionCache()
  const cache = createEmotionCache(dir)
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />
        },
    })

  const initialProps = await Document.getInitialProps(ctx)
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  return {
    ...initialProps,
    locale,
    // Styles fragment is rendered after the app and page rendering finish.
    emotionStyleTags,
  }
}
