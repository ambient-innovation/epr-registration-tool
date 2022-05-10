const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
        outline: false,
      },
    },
    '@storybook/addon-a11y',
  ],
  features: {
    // a fix to be able to load typographies styles
    emotionAlias: false,
  },
  framework: '@storybook/react',
  webpackFinal: async (config) => {
    // tell storybook the location of .tsconfig
    config.resolve.plugins = [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../tsconfig.json'),
      }),
    ]
    // make css prop work in stories
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader'),
      options: {
        plugins: ['@emotion/babel-plugin'],
        presets: [
          [
            'next/babel',
            {
              'preset-react': {
                runtime: 'automatic',
                importSource: '@emotion/react',
              },
            },
          ],
        ],
      },
    })
    // Please see `next.config.js` for more details on this
    // Since Storybook is a pure browser app, we don't need `@sentry/node` at all
    config.resolve.alias['@sentry/node'] = '@sentry/react'
    return config
  },
}
