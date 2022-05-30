import { Story, Meta } from '@storybook/react'

import {
  initialData,
  RegistrationContext,
  RegistrationContextValue,
} from './RegistrationContext'
import { RegistrationSection, RegistrationStepper } from './RegistrationSection'

export default {
  title: 'Auth/RegistrationSection',
  component: RegistrationSection,
} as Meta<RegistrationSection>

const Template: Story<RegistrationSection> = (args) => {
  return <RegistrationSection {...args} />
}

export const Default = Template.bind({})
Default.args = {}

export const Step1: Story<RegistrationContextValue> = (args) => {
  return (
    <RegistrationContext.Provider value={args}>
      <RegistrationStepper />
    </RegistrationContext.Provider>
  )
}
Step1.args = {
  activeStep: 0,
  data: initialData,
  initialData,
  onSubmit: () => null,
  goToPrevStep: undefined,
}

export const Step2: Story<RegistrationContextValue> = (args) => {
  return (
    <RegistrationContext.Provider value={args}>
      <RegistrationStepper />
    </RegistrationContext.Provider>
  )
}
Step2.args = {
  activeStep: 1,
  data: initialData,
  initialData,
  onSubmit: () => null,
  goToPrevStep: undefined,
}

export const Step3: Story<RegistrationContextValue> = (args) => {
  return (
    <RegistrationContext.Provider value={args}>
      <RegistrationStepper />
    </RegistrationContext.Provider>
  )
}
Step3.args = {
  activeStep: 2,
  data: initialData,
  initialData,
  onSubmit: () => null,
  goToPrevStep: undefined,
}
