import { Meta, Story } from '@storybook/react'

import { FullWidthImageBlock } from '@/cms/components/blocks/FullWidthImage/FullWidthImageBlock'

export default {
  title: 'cms/blocks/FullWidthImage',
  component: FullWidthImageBlock,
} as Meta<FullWidthImageBlock>

const Template: Story<FullWidthImageBlock> = (props) => {
  return <FullWidthImageBlock {...props} />
}

export const Default = Template.bind({})
Default.args = {
  image: {
    alt_text: 'alt text',
    url: '/assets/landscape-pic.png',
    width: 840,
    height: 859,
  },
  header: 'This is header with some text',
}
