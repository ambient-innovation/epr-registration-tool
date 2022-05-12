import { Box } from '@mui/material'

import { defaultSectionCss } from '@/theme/layout'

import { HeroImage } from '..'
import {
  containerCss,
  contentColumnCss,
  imageWrapperCss,
} from './FormLayout.styles'

export type FormLayoutContent = {
  children: React.ReactNode
}

export const FormLayoutContent = ({
  children,
}: FormLayoutContent): React.ReactElement => {
  return <Box flexGrow={1}>{children}</Box>
}

export type FormLayout = {
  children: React.ReactNode
}

export const FormLayout = ({ children }: FormLayout): React.ReactElement => {
  return (
    <div css={containerCss}>
      <div css={imageWrapperCss}>
        <HeroImage />
      </div>
      <div css={defaultSectionCss}>
        <div css={contentColumnCss}>{children}</div>
      </div>
    </div>
  )
}
