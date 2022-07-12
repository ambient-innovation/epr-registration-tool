import { StreamBlock } from '@/cms/types'

import { StreamBlockSection } from './StreamBlockSection'

export interface StreamFieldSection {
  blocks: StreamBlock[]
}

export const StreamFieldSection = (
  props: StreamFieldSection
): React.ReactElement => {
  return (
    <div>
      {props.blocks.map((block) => (
        <StreamBlockSection key={block.id} block={block} />
      ))}
    </div>
  )
}
