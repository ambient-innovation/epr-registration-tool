import { Box } from '@mui/material'

import { StreamBlock } from '@/cms/types'
import { RichText } from '@/common/components/RichText'
import { defaultContainerSx } from '@/theme/layout'

export interface StreamBlockSection {
  block: StreamBlock
}

export const StreamBlockSection = ({
  block,
}: StreamBlockSection): React.ReactElement => {
  const blockType = block.type
  switch (blockType) {
    case 'paragraph':
      return (
        <Box sx={defaultContainerSx}>
          <RichText html={block.value} />
        </Box>
      )
    case 'image':
      // >>> this is a placeholder <<<<
      return <span>{block.id}</span>
  }
  return <span>{`Unkown block type "${blockType}"`}</span>
}
