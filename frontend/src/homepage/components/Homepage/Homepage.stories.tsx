import { Story, Meta } from '@storybook/react'

import { Homepage } from './Homepage'

export default {
  title: 'components/Homepage',
  component: Homepage,
} as Meta<Homepage>

const Template: Story<Homepage> = (args) => <Homepage {...args} />

export const Default = Template.bind({})
