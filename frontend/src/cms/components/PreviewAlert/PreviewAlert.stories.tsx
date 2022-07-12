import { Meta, Story } from '@storybook/react'

import { PreviewAlert } from './PreviewAlert'

export default {
  title: 'cms/PreviewAlert',
  component: PreviewAlert,
} as Meta<PreviewAlert>

const Template: Story<PreviewAlert> = (props) => {
  return <PreviewAlert {...props} />
}

export const Default = Template.bind({})
Default.args = {}
