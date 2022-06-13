import { Card, Chip, Typography, Box, Stack } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { PackagingReportType } from '@/api/__types__'

import { cardContentSx, statusChipSx } from './ReportCard.styles'

export type ReportCard = Pick<
  PackagingReportType,
  | 'id'
  | 'createdAt'
  | 'startMonth'
  | 'year'
  | 'timeframe'
  | 'packagingGroupsCount'
>

export const ReportCard = ({
  id: reportId,
  createdAt,
  startMonth,
  year,
  timeframe,
  packagingGroupsCount,
}: ReportCard): React.ReactElement => {
  const { t } = useTranslation()
  const startDate = new Date(year, startMonth - 1, 1)
  const formattedStartDate = startDate.toLocaleDateString()
  const formattedSubmitDate = new Date(createdAt).toLocaleDateString()
  // uncomment to display remaining number of days for editing
  // const daysLeftForEditing = differenceInDays(startDate, new Date())
  const daysLeftForEditing = 0

  const statusChip = (
    <Chip
      label={t('dashboard.reportListSection.reportCard.forecast')}
      sx={statusChipSx}
      role={'listitem'}
    />
  )
  // const editButton = <Button variant={'contained'}>{'Edit'}</Button>

  const reportNumber = reportId

  return (
    <Card sx={{ boxShadow: 11, borderRadius: 3 }}>
      <Box sx={cardContentSx}>
        <Box
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Typography variant={'h6'}>
            {t('dashboard.reportListSection.reportCard.title', {
              reportNumber,
            })}
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>{statusChip}</Box>
          {/* <ButtonGroup sx={{ ml: 'auto' }}>{editButton}</ButtonGroup> */}
        </Box>
        <Typography variant={'caption'}>
          {`${t(
            'dashboard.reportListSection.reportCard.submittedOn'
          )} ${formattedSubmitDate}`}
        </Typography>
        <Box sx={{ display: { xs: 'block', sm: 'inline-block', md: 'none' } }}>
          {statusChip}
        </Box>

        <Stack direction={{ xs: 'column', md: 'row' }} mt={8} spacing={4}>
          <Box sx={{ flex: 1 }}>
            <Typography variant={'body2'}>
              {`${t('dashboard.reportListSection.reportCard.startsAt')} `}
              <Typography component={'span'} variant={'subtitle2'}>
                {formattedStartDate}
              </Typography>
            </Typography>
            <Typography variant={'body2'}>
              {`${t('dashboard.reportListSection.reportCard.timeframe')} `}
              <Typography component={'span'} variant={'subtitle2'}>
                {`${timeframe} ${t(
                  'dashboard.reportListSection.reportCard.month'
                )}`}
              </Typography>
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant={'body2'}>
              {`${t(
                'dashboard.reportListSection.reportCard.entries'
              )} ${packagingGroupsCount}`}
            </Typography>
            <Typography variant={'body2'}>
              {`${t('dashboard.reportListSection.reportCard.estimatedF')} `}
              <Typography component={'span'} variant={'subtitle2'}>
                {'1000 JD'}
              </Typography>
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              textAlign: { md: 'right' },
              alignSelf: { md: 'flex-end' },
            }}
          >
            {daysLeftForEditing > 0 && (
              <Typography variant={'body2'} color={'text.disabled'}>
                {t('dashboard.reportListSection.reportCard.editable', {
                  days: daysLeftForEditing,
                })}
              </Typography>
            )}
          </Box>
        </Stack>
        {/* <Stack sx={{ mt: 10, display: { md: 'none' } }} spacing={6}>
          {editButton}
        </Stack> */}
      </Box>
    </Card>
  )
}
