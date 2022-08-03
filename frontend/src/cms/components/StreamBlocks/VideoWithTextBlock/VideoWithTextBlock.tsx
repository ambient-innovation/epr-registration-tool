import { Box } from '@mui/material'
import React from 'react'

import { BaseBlock } from '@/cms/components/StreamBlocks/BaseBlock'
import { HeadingWithTextAndCta } from '@/cms/components/StreamBlocks/TextBlock'
import { VideoPlayer } from '@/cms/components/StreamBlocks/VideoPlayer'
import {
  autoMarginSx,
  videoPlayerWrapper,
} from '@/cms/components/StreamBlocks/VideoWithTextBlock/VideoWithTextBlock.styles'
import { VideoWithTextBlockData } from '@/cms/types'
import { defaultSectionSx } from '@/theme/layout'

export type VideoWithTextBlock = VideoWithTextBlockData['value']

export const VideoWithTextBlock = ({
  text,
  video_url,
  background,
  orientation,
}: VideoWithTextBlock): React.ReactElement => {
  return (
    <BaseBlock background={background}>
      {orientation === 'videoFirst' ? (
        <Box sx={[...defaultSectionSx, { rowGap: 11 }]}>
          <Box sx={autoMarginSx} gridColumn={{ xs: '1 / -1', md: '1 / 7' }}>
            <Box sx={videoPlayerWrapper}>
              <VideoPlayer src={video_url} />
            </Box>
          </Box>
          <Box
            sx={autoMarginSx}
            gridColumn={{ xs: '1 / -1', sm: '1 / -3', md: '7 / -1' }}
          >
            <HeadingWithTextAndCta orientation={'left'} {...text} />
          </Box>
        </Box>
      ) : (
        <Box sx={[...defaultSectionSx, { rowGap: 11 }]}>
          <Box
            sx={autoMarginSx}
            gridColumn={{ xs: '1 / -1', sm: '1 / -3', md: '1 / 7' }}
          >
            <HeadingWithTextAndCta orientation={'left'} {...text} />
          </Box>
          <Box sx={autoMarginSx} gridColumn={{ xs: '1 / -1', md: '7 / -1' }}>
            <Box sx={videoPlayerWrapper}>
              <VideoPlayer src={video_url} />
            </Box>
          </Box>
        </Box>
      )}
    </BaseBlock>
  )
}
