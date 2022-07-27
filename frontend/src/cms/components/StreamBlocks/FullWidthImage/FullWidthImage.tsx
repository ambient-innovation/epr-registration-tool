import { Box, Typography } from '@mui/material'
import Image from 'next/image'

import { CmsImageValue } from '@/cms/types'
import { defaultSectionSx, maxWidthCss } from '@/theme/layout'

import { headingSx, headingWrapperSx, wrapperSx } from './FullWidthImage.styles'

export interface FullWidthImage {
  image: CmsImageValue
  heading?: string
}

export const FullWidthImage = ({ heading, image }: FullWidthImage) => {
  return (
    <>
      <Box sx={maxWidthCss}>
        <Box sx={wrapperSx}>
          {!!heading && (
            <Box sx={headingWrapperSx}>
              <Typography sx={headingSx} variant={'h1'} component={'h2'}>
                {heading}
              </Typography>
            </Box>
          )}
          <Image
            src={image.url}
            alt={image.alt_text}
            width={1024}
            height={512}
            objectFit={'cover'}
            objectPosition={'center center'}
          />
        </Box>
      </Box>
      {image.caption && (
        <Box sx={defaultSectionSx} mt={4}>
          <Typography
            variant={'caption'}
            textAlign={'center'}
            gridColumn={{ xs: '1 / -1', sm: '2 / -2', md: '3 / -3' }}
          >
            {image.caption}
          </Typography>
        </Box>
      )}
    </>
  )
}
