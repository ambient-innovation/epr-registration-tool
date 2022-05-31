import { Story, Meta } from '@storybook/react'

import { Dashboard } from './Dashboard'

export default {
  title: 'dashboard/Main',
  component: Dashboard,
} as Meta<Dashboard>

const Template: Story<Dashboard> = (args) => <Dashboard {...args} />

export const Default = Template.bind({})
