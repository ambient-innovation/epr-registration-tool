import { Story } from '@storybook/react'

import { TimeframeType } from '@/api/__types__'

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
export const PaidReport = Template.bind({})

EditableForecast.args = {
  id: '1',
  createdAt: '2022-06-01 15:26:20.360428+00',
  startMonth: 9,
  year: 2022,
  timeframe: TimeframeType.THREE_MONTHS,
  packagingGroupsCount: 3,
  isForecastEditable: true,
  isFinalReportSubmitted: false,
  fees: null,
  isPaid: false,
}

NonEditableForecast.args = {
  id: '2',
  createdAt: '2022-03-01 15:26:20.360428+00',
  startMonth: 5,
  year: 2022,
  timeframe: TimeframeType.TWELVE_MONTHS,
  packagingGroupsCount: 3,
  isForecastEditable: false,
  isFinalReportSubmitted: true,
  fees: 99.99,
  isPaid: false,
}

PaidReport.args = {
  id: '2',
  createdAt: '2022-03-01 15:26:20.360428+00',
  startMonth: 5,
  year: 2022,
  timeframe: TimeframeType.TWELVE_MONTHS,
  packagingGroupsCount: 3,
  isForecastEditable: false,
  isFinalReportSubmitted: true,
  fees: 99.99,
  isPaid: true,
}
