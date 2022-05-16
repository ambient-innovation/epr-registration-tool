import { CssBaseline, ThemeProvider } from '@mui/material'
import { addDecorator } from '@storybook/react'

import { theme } from '../src/theme'
import './nextImage'
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

export const CustomHooksDecorator = (storyFn, context) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Story storyFn={storyFn} />
  </ThemeProvider>
)

addDecorator(CustomHooksDecorator)

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    hideNoControlsWarning: true,
  },
  viewport: {
    viewports: customViewports,
  },
}
