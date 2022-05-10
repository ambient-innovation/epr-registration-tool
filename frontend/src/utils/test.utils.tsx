import { ThemeProvider } from '@mui/material'
import { render, RenderOptions } from '@testing-library/react'

import { theme } from '@/theme'

interface AllProviders {
  children: React.ReactNode
}

const AllProviders = ({ children }: AllProviders): React.ReactElement => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
