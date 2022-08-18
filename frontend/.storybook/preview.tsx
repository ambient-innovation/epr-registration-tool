import { MockedProvider } from '@apollo/client/testing'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { addDecorator } from '@storybook/react'
import i18n from 'i18next'
import React from 'react'
import { useEffect } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'

// @ts-ignore
import commonAr from '../public/locales/ar/common.json'
// @ts-ignore
import commonEn from '../public/locales/en/common.json'
import { DEFAULT_LOCALE, LOCALES } from '../src/config/i18n'
import { theme } from '../src/theme'
import { customViewports } from './viewports'

/**
 * To be able to use React hooks directly inside stories,
 * React requires the <StoryFn> syntax, instead of {storyFn()}.
 *https://github.com/storybookjs/storybook/issues/8426#issuecomment-542312992
 *
 * The following `<Story storyFn={storyFn} />` component is an improvement to that:
 * https://github.com/storybookjs/storybook/issues/8426#issuecomment-669021940
 * */
const Story = ({ storyFn }) => storyFn()

const TranslationsDecorator = (Story, context) => {
  const lng = context.globals.lng
  i18n.use(initReactI18next).init({
    resources: {
      ar: { common: commonAr },
      en: { common: commonEn },
    },
    fallbackLng: 'en',
    ns: ['common'],
  })

  useEffect(() => {
    i18n.changeLanguage(lng)
  }, [lng])

  return (
    <I18nextProvider i18n={i18n}>
      <Story {...context} />
    </I18nextProvider>
  )
}

export const CustomHooksDecorator = (storyFn, context) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Story storyFn={storyFn} />
  </ThemeProvider>
)

addDecorator(CustomHooksDecorator)
addDecorator(TranslationsDecorator)

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    hideNoControlsWarning: true,
  },
  layout: 'fullscreen',
  viewport: {
    viewports: customViewports,
  },
  apolloClient: {
    MockedProvider,
  },
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
}
