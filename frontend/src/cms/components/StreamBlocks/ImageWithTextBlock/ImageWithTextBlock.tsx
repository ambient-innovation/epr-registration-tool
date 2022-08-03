import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'

import { BaseBlock } from '@/cms/components/StreamBlocks/BaseBlock'
import { FullWidthImage } from '@/cms/components/StreamBlocks/FullWidthImage'
import {
  BaseTextBlock,
  HeadingWithTextAndCta,
} from '@/cms/components/StreamBlocks/TextBlock'
import { ImageWithTextBlockData } from '@/cms/types'
import { defaultSectionSx } from '@/theme/layout'

export type ImageWithTextBlock = ImageWithTextBlockData['value']

const ImageWithCaption = (
  image: ImageWithTextBlock['image']
): React.ReactElement => {
  return (
    <Box>
      <Image
        src={image.url}
        alt={image.alt_text}
        layout={'responsive'}
        // with layout="responsive"
        // width and height only define the aspect ratio
        width={image.width}
        height={image.height}
        sizes={'(min-width: 1024px) 313px, 100vw'}
        objectFit={'cover'}
        objectPosition={'center center'}
        placeholder={image.placeholder ? 'blur' : undefined}
        blurDataURL={image.placeholder || undefined}
      />
      <Typography variant={'caption'} mt={4} textAlign={'center'}>
        {image.caption}
      </Typography>
    </Box>
  )
}

export const ImageWithTextBlock = ({
  text,
  image,
  background,
  orientation,
}: ImageWithTextBlock): React.ReactElement => {
  return (
    <BaseBlock background={background}>
      {orientation === 'fullWidthImage' ? (
        <>
          <FullWidthImage image={image} />
          <Box mt={11}>
            <BaseTextBlock
              orientation={orientation === 'fullWidthImage' ? 'center' : 'left'}
              {...text}
            />
          </Box>
        </>
      ) : orientation === 'imageFirst' ? (
        <Box sx={[...defaultSectionSx, { rowGap: 11 }]}>
          <Box gridColumn={{ xs: '1 / -1', md: '1 / 5' }}>
            <ImageWithCaption {...image} />
          </Box>
          <Box gridColumn={{ xs: '1 / -1', sm: '1 / -3', md: '5 / -1' }}>
            <HeadingWithTextAndCta orientation={'left'} {...text} />
          </Box>
        </Box>
      ) : (
        <Box sx={[...defaultSectionSx, { rowGap: 11 }]}>
          <Box gridColumn={{ xs: '1 / -1', sm: '1 / -3', md: '1 / 9' }}>
            <HeadingWithTextAndCta orientation={'left'} {...text} />
          </Box>
          <Box gridColumn={{ xs: '1 / -1', md: '9 / -1' }}>
            <ImageWithCaption {...image} />
          </Box>
        </Box>
      )}
    </BaseBlock>
  )
}
