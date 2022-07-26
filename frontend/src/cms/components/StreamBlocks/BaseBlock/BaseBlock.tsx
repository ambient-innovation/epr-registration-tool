import { Box } from '@mui/material'

import { BackgroundOption } from '@/cms/types'

export interface BaseBlock {
  background?: BackgroundOption
  children: React.ReactNode
  padded?: boolean
}

export const BaseBlock = ({
  background = 'default',
  children,
  padded = true,
}: BaseBlock): React.ReactElement => {
  const backgroundColor =
    background === 'shaded' ? 'background.light' : undefined

  return (
    <Box
      sx={{
        backgroundColor,
        paddingY: padded ? { xs: 10, md: 11, lg: 12, xl: 13 } : undefined,
      }}
    >
      {children}
    </Box>
  )
}
