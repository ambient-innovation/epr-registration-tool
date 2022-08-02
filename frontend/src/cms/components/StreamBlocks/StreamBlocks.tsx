import { PdfDownloadBlock } from '@/cms/components/StreamBlocks/PdfDownloadBlock'
import { StreamBlockData } from '@/cms/types'

import { FullWidthImageBlock } from './FullWidthImageBlock'
import { ImageWithTextBlock } from './ImageWithTextBlock'
import { TextStreamBlock } from './TextBlock'

export interface StreamBlockSection {
  block: StreamBlockData
}

export const StreamBlockSection = ({
  block,
}: StreamBlockSection): React.ReactElement => {
  const blockType = block.type
  switch (blockType) {
    case 'text':
      return <TextStreamBlock {...block.value} />
    case 'fullWidthImage':
      return <FullWidthImageBlock {...block.value} />
    case 'imageWithText':
      return <ImageWithTextBlock {...block.value} />
    case 'pdfDownload':
      return <PdfDownloadBlock {...block.value} />
  }
  return <span>{`Unknown block type "${blockType}"`}</span>
}

export interface StreamBlocks {
  blocks: StreamBlockData[]
}

export const StreamBlocks = (props: StreamBlocks): React.ReactElement => {
  return (
    <div>
      {props.blocks.map((block) => (
        <StreamBlockSection key={block.id} block={block} />
      ))}
    </div>
  )
}
