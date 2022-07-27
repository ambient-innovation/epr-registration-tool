import React from 'react'

import { BaseBlock } from '@/cms/components/StreamBlocks/BaseBlock'
import { FullWidthImageBlockData } from '@/cms/types'

import { FullWidthImage } from '../FullWidthImage/FullWidthImage'

export type FullWidthImageBlock = FullWidthImageBlockData['value']

export const FullWidthImageBlock = ({
  background,
  ...props
}: FullWidthImageBlock): React.ReactElement => {
  return (
    <BaseBlock background={background}>
      <FullWidthImage {...props} />
    </BaseBlock>
  )
}
