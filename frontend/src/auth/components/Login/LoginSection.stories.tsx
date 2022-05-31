import { Story, Meta } from '@storybook/react'

import { LoginSection } from './LoginSection'

export default {
  title: 'auth/LoginSection',
  component: LoginSection,
} as Meta<typeof LoginSection>

const Template: Story<typeof LoginSection> = (args) => (
  <LoginSection {...args} />
)

export const Default = Template.bind({})
