// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dns = require('dns')

// node18 uses ipv6 by default
// Using "localhost" as backend URL causes a fetch error `ECONNREFUSED`
// So far, we know of two ways to solve this problem:
// 1. Use 127.0.0.1 instead of localhost, which causes other issues with CORS
// 2. Use ipv4first as default result order <-- this is what we do here
dns.setDefaultResultOrder('ipv4first')

const nextConfig = {
  i18n,
  reactStrictMode: true,
  output: 'standalone',
  compiler: {
    emotion: true,
  },
  images: {
    domains: [
      'localhost',
      'epr-tool.ambient.digital',
      'epr-registration-tool-test.s3.amazonaws.com',
    ],
  },
  webpack: (config, options) => {
    // In `pages/_app.js`, Sentry is imported from @sentry/node. While
    // @sentry/react will run in a Node.js environment, @sentry/node will use
    // Node.js-only APIs to catch even more unhandled exceptions.
    //
    // This works well when Next.js is SSRing your page on a server with
    // Node.js, but it is not what we want when your client-side bundle is being
    // executed by a browser.
    //
    // Luckily, Next.js will call this webpack function twice, once for the
    // server and once for the client. Read more:
    // https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
    //
    // So ask Webpack to replace @sentry/node imports with @sentry/react when
    // building the browser's bundle
    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/react'
    }

    return config
  },
}

module.exports = nextConfig
