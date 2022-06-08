import { Story, Meta } from '@storybook/react'

import { CompletionAlert } from './CompletionAltert'

export default {
  title: 'dashboard/CompletionAlert',
  component: CompletionAlert,
} as Meta<CompletionAlert>

const Template: Story<CompletionAlert> = (args) => <CompletionAlert {...args} />

export const Default = Template.bind({})
