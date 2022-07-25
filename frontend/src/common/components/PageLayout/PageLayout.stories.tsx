import { Story } from '@storybook/react'

import { PageLayout } from './PageLayout'

export default {
  title: 'Common/PageLayout',
  component: PageLayout,
  properties: {
    layout: 'fullscreen',
  },
}

const Template: Story<PageLayout> = (args) => {
  return <PageLayout {...args} />
}

export const Default = Template.bind({})
Default.args = {
  menuPages: [
    { title: 'Hello world', href: '/page-1' },
    { title: 'Foo', href: '/page-2' },
    { title: 'Bar', href: '/page-3' },
  ],
}
