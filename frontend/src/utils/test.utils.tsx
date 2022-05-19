import { ThemeProvider } from '@mui/material'
import { render, RenderOptions } from '@testing-library/react'
import i18n from 'i18next'
import React from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'

import { theme } from '@/theme'

import commonAr from '../../public/locales/ar/common.json'
import commonEn from '../../public/locales/en/common.json'

i18n.use(initReactI18next).init({
  resources: {
    ar: { common: commonAr },
    en: { common: commonEn },
  },
  fallbackLng: 'en',
  ns: ['common'],
})

interface AllProviders {
  children: React.ReactNode
}

const AllProviders = ({ children }: AllProviders): React.ReactElement => {
  return (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </ThemeProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
