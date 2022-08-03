import { Box } from '@mui/material'
import React from 'react'

import { BaseBlock } from '@/cms/components/StreamBlocks/BaseBlock'
import { VideoPlayer } from '@/cms/components/StreamBlocks/VideoPlayer'
import { FullWidthVideoBlockData } from '@/cms/types'
import { maxWidthCss, paddedSectionCss } from '@/theme/layout'

import {
  headingSx,
  headingWrapperSx,
  videoPlayerWrapper,
  wrapperSx,
} from './FullWidthVideoblock.styles'

export type FullWidthVideoBlock = FullWidthVideoBlockData['value']

export const FullWidthVideoBlock = ({
  video_url,
  heading,
  background,
}: FullWidthVideoBlock): React.ReactElement => {
  return (
    <BaseBlock background={background}>
      <Box sx={[paddedSectionCss, maxWidthCss]}>
        <Box sx={wrapperSx}>
          {!!heading && (
            <Box sx={headingWrapperSx}>
              <Box sx={headingSx} component={'h2'}>
                {heading}
              </Box>
            </Box>
          )}
          <Box sx={videoPlayerWrapper}>
            <VideoPlayer src={video_url} />
          </Box>
        </Box>
      </Box>
    </BaseBlock>
  )
}
