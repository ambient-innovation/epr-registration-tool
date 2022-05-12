import { Story } from '@storybook/react'

import { HeroImage } from './HeroImage'

export default {
  title: 'Common/MultiStepForm/HeroImage',
  component: HeroImage,
}

const Template: Story<HeroImage> = (args) => {
  return <HeroImage {...args} />
}

export const Default = Template.bind({})
Default.args = {}
