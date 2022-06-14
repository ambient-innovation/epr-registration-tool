import { Story } from '@storybook/react'

import { ReportCard } from './ReportCard'

export default {
  title: 'dashboard/ReportListSection/ReportCard',
  component: ReportCard,
}

const Template: Story<ReportCard> = (args) => {
  return <ReportCard {...args} />
}
export const EditableForecast = Template.bind({})
export const NonEditableForecast = Template.bind({})

EditableForecast.args = {
  id: '1',
  createdAt: '2022-06-01 15:26:20.360428+00',
  startMonth: 9,
  year: 2022,
  timeframe: 3,
  packagingGroupsCount: 3,
}

NonEditableForecast.args = {
  id: '2',
  createdAt: '2022-03-01 15:26:20.360428+00',
  startMonth: 5,
  year: 2022,
  timeframe: 3,
  packagingGroupsCount: 3,
}