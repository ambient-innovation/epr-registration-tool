import { Meta, Story } from '@storybook/react'

import { mockRickText } from '@/cms/components/PreviewAlert/mocks'
import { StreamFieldSection } from '@/cms/components/StreamFieldSection/StreamFieldSection'
import { StreamBlock } from '@/cms/types'

import { StreamBlockSection } from './StreamBlockSection'

export default {
  title: 'cms/StreamField',
  component: StreamBlockSection,
} as Meta<StreamBlockSection>

const StreamBlockTemplate: Story<StreamBlockSection> = (props) => {
  return <StreamBlockSection {...props} />
}

const paragraphBlockProps: StreamBlock = {
  type: 'paragraph',
  id: '1',
  value: mockRickText,
}

const imageBlockProps: StreamBlock = {
  type: 'image',
  id: '1',
  alt_text: 'This is a human readable image description',
  image: {
    width: 1024,
    height: 512,
    url: 'https://picsum.photos/512/1024',
  },
}

export const ParagraphBlock = StreamBlockTemplate.bind({})
ParagraphBlock.args = {
  block: paragraphBlockProps,
}

export const ImageBlock = StreamBlockTemplate.bind({})
ImageBlock.args = {
  block: imageBlockProps,
}

export const StreamField = () => {
  return <StreamFieldSection blocks={[paragraphBlockProps, imageBlockProps]} />
}
