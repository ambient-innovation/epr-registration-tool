import { Meta, Story } from '@storybook/react'

import { CtaValue, StreamBlockData } from '@/cms/types'

import { StreamBlocks, StreamBlockSection } from './StreamBlocks'
import { mockRickText } from './mocks'

export default {
  title: 'cms/StreamBlocks',
  component: StreamBlocks,
} as Meta<StreamBlocks>

const StreamBlockTemplate: Story<StreamBlockSection> = (props) => {
  return <StreamBlockSection {...props} />
}

const ctaProps: CtaValue = {
  label: 'Follow me!',
  internal_page: {
    type: 'cms.StandardPage',
    slug: 'foo',
  },
  external_link: '',
}

const textBlockProps: StreamBlockData = {
  type: 'text',
  id: 'b74d4511-e688-4214-9376-12a91a9c0291',
  value: {
    heading: 'Hello World!',
    body: mockRickText,
    orientation: 'left',
    background: 'default',
    cta: {
      label: 'Follow me!',
      internal_page: {
        type: 'cms.StandardPage',
        slug: 'foo',
      },
      external_link: '',
    },
  },
}

const fullWithImageBlockProps: StreamBlockData = {
  type: 'fullWidthImage',
  id: 'b74d4511-e688-4214-9376-12a91a9c0292',
  value: {
    image: {
      url: '/assets/landscape-pic.png',
      width: 840,
      height: 859,
      alt_text: 'Nice landscape',
      caption:
        'Auch gibt es niemanden, der den Schmerz an sich liebt, sucht oder wünscht, nur, weil er Schmerz ist, ' +
        'es sei denn, es kommt zu zufälligen Umständen, in denen Mühen und Schmerz ihm große',
      placeholder: null,
    },
    heading: 'This is header with some text',
    background: 'shaded',
  },
}

const imageWithTextBlockProps: StreamBlockData = {
  type: 'imageWithText',
  id: 'b74d4511-e688-4214-9376-12a91a9c0293',
  value: {
    image: {
      alt_text: 'This is a Human readable image description',
      width: 1024,
      height: 512,
      url: 'https://picsum.photos/512/1024',
      caption:
        'Auch gibt es niemanden, der den Schmerz an sich liebt, sucht oder wünscht, nur, weil er Schmerz ist, ' +
        'es sei denn, es kommt zu zufälligen Umständen, in denen Mühen und Schmerz ihm große',
      placeholder: null,
    },
    text: {
      heading: 'This is a nice header',
      body: mockRickText,
      cta: ctaProps,
    },
    orientation: 'textFirst',
    background: 'default',
  },
}

export const TextLeft = StreamBlockTemplate.bind({})
TextLeft.args = {
  block: textBlockProps,
}
export const TextCenter = StreamBlockTemplate.bind({})
TextCenter.args = {
  block: {
    ...textBlockProps,
    value: {
      ...textBlockProps.value,
      orientation: 'center',
    },
  },
}

export const FullWidthImage = StreamBlockTemplate.bind({})
FullWidthImage.args = {
  block: fullWithImageBlockProps,
}

export const ImageWithTextLeft = StreamBlockTemplate.bind({})
ImageWithTextLeft.args = {
  block: imageWithTextBlockProps,
}

export const ImageWithTextFullWidth = StreamBlockTemplate.bind({})
ImageWithTextFullWidth.args = {
  block: {
    ...imageWithTextBlockProps,
    value: {
      ...imageWithTextBlockProps.value,
      orientation: 'fullWidthImage',
    },
  },
}

export const ImageWithTextRight = StreamBlockTemplate.bind({})
ImageWithTextRight.args = {
  block: {
    ...imageWithTextBlockProps,
    value: {
      ...imageWithTextBlockProps.value,
      orientation: 'imageFirst',
    },
  },
}

export const StreamField = () => {
  return (
    <StreamBlocks
      blocks={[
        fullWithImageBlockProps,
        textBlockProps,
        imageWithTextBlockProps,
      ]}
    />
  )
}
