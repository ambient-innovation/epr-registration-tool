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
  image: {
    alt_text: 'This is a Human readable image description',
    width: 1024,
    height: 512,
    url: 'https://picsum.photos/512/1024',
  },
}

const fullWithImageBlockProps: StreamBlock = {
  type: 'fullWidthImage',
  id: 'b74d4511-e688-4214-9376-12a91a9c0295',
  value: {
    image: {
      url: '/assets/landscape-pic.png',

      width: 840,
      height: 859,
      alt_text: 'alt text',
    },
    header: 'This is header with some text',
  },
}

export const ParagraphBlock = StreamBlockTemplate.bind({})
ParagraphBlock.args = {
  block: paragraphBlockProps,
}

export const FullWidthImageBlock = StreamBlockTemplate.bind({})
FullWidthImageBlock.args = {
  block: fullWithImageBlockProps,
}

export const ImageBlock = StreamBlockTemplate.bind({})
ImageBlock.args = {
  block: imageBlockProps,
}

export const StreamField = () => {
  return <StreamFieldSection blocks={[paragraphBlockProps, imageBlockProps]} />
}
