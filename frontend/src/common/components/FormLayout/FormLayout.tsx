import { Box } from '@mui/material'

import { defaultSectionSx } from '@/theme/layout'

import {
  containerCss,
  contentColumnSx,
  contentColumnWithHeroSx,
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
  showHeroImage?: boolean
}

export const FormLayout = ({
  children,
  showHeroImage = true,
}: FormLayout): React.ReactElement => {
  return (
    <Box sx={containerCss}>
      {showHeroImage && (
        <Box sx={imageWrapperSx}>
          <HeroImage />
        </Box>
      )}
      <Box sx={defaultSectionSx}>
        <Box sx={showHeroImage ? contentColumnWithHeroSx : contentColumnSx}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
