import { Typography, Box } from '@mui/material'
import Image from 'next/image'
import React from 'react'

import { ImageBlockValue } from '@/cms/types'
import { pxToRemAsString } from '@/theme/utils'

import { wrapperSx } from './FullWidthImageBlock.styles'

export interface FullWidthImageBlock {
  image: ImageBlockValue
  header: string
}

export const FullWidthImageBlock = ({
  header,
  image,
}: FullWidthImageBlock): React.ReactElement => {
  return (
    <Box sx={wrapperSx}>
      <Box
        sx={{
          padding: pxToRemAsString(16),
          zIndex: '1',
          position: 'absolute',
          backgroundColor: '#ffffffe6',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <Typography variant={'h1'}>{header}</Typography>
      </Box>
      <Image
        src={image.url}
        alt={image.alt_text}
        layout="fill"
        objectFit="fill"
      />
    </Box>
  )
}
