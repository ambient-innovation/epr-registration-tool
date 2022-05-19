import { Story, Meta } from '@storybook/react'

import {
  initialData,
  RegistrationContext,
  RegistrationContextType,
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

export const Step1: Story<RegistrationContextType> = (args) => {
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

export const Step2: Story<RegistrationContextType> = (args) => {
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

export const Step3: Story<RegistrationContextType> = (args) => {
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

export const Step4: Story<RegistrationContextType> = (args) => {
  return (
    <RegistrationContext.Provider value={args}>
      <RegistrationStepper />
    </RegistrationContext.Provider>
  )
}
Step4.args = {
  activeStep: 3,
  data: initialData,
  initialData,
  onSubmit: () => null,
  goToPrevStep: undefined,
}
