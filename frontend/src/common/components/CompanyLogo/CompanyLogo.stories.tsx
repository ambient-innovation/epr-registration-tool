import { Story } from '@storybook/react'

import { CompanyLogo } from './CompanyLogo'

export default {
  title: 'Common/CompanyLogo',
  component: CompanyLogo,
}

const Template: Story<CompanyLogo> = (args) => {
  return <CompanyLogo {...args} />
}

export const WithoutLogo = Template.bind({})
WithoutLogo.args = {}
export const WithLogo = Template.bind({})
WithLogo.args = {
  imageSrc: '/example-logo.jpeg',
}
