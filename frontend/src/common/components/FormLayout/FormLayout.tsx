import { Box } from '@mui/material'

import { defaultSectionSx } from '@/theme/layout'

import {
  containerCss,
  contentColumnSx,
  imageWrapperSx,
} from './FormLayout.styles'
import { HeroImage } from './HeroImage'

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
    <Box sx={containerCss}>
      <Box sx={imageWrapperSx}>
        <HeroImage />
      </Box>
      <Box sx={defaultSectionSx}>
        <Box sx={contentColumnSx}>{children}</Box>
      </Box>
    </Box>
  )
}
