import { Story, Meta } from '@storybook/react'

import {
  initialData,
  CompanyProfileContext,
  CompanyProfileContextValue,
} from './CompanyProfileContext'
import {
  CompanyProfileSection,
  CompanyProfileStepper,
} from './CompanyProfileSection'

export default {
  title: 'dashboard/CompanyProfileSection',
  component: CompanyProfileSection,
} as Meta<CompanyProfileSection>

const Template: Story<CompanyProfileSection> = (args) => {
  return <CompanyProfileSection {...args} />
}

export const Default = Template.bind({})

export const Step1: Story<CompanyProfileContextValue> = (args) => {
  return (
    <CompanyProfileContext.Provider value={args}>
      <CompanyProfileStepper />
    </CompanyProfileContext.Provider>
  )
}
Step1.args = {
  activeStep: 0,
  data: initialData,
  initialData,
  onSubmit: () => null,
  goToPrevStep: undefined,
}
