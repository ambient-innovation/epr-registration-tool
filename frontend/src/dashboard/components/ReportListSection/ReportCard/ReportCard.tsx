import { Card, Chip, Typography, Box, Stack, Button } from '@mui/material'
import { addMonths, differenceInDays } from 'date-fns'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'

import { PackagingReportType } from '@/api/__types__'
import { timeframeDisplayValue, timeframeNumberValue } from '@/common/contants'
import { ROUTES } from '@/routes'

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
  // forecast is editable until end date
  const endDate = addMonths(startDate, timeframeNumberValue[timeframe])
  const formattedEndDate = endDate.toLocaleDateString()
  const isEditable = differenceInDays(endDate, new Date()) > 0

  const statusChip = (
    <Chip
      label={t('dashboard.reportListSection.reportCard.forecast')}
      sx={statusChipSx}
      role={'listitem'}
    />
  )
  const editButton = (
    <NextLink href={ROUTES.forecastChange(reportId)} passHref>
      <Button component={'a'} variant={'contained'}>
        {t('edit')}
      </Button>
    </NextLink>
  )

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
          {isEditable && (
            <Box sx={{ ml: 'auto', display: { xs: 'none', md: 'block' } }}>
              {editButton}
            </Box>
          )}
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
                {timeframeDisplayValue(t)[timeframe]}
              </Typography>
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant={'body2'}>
              {`${t(
                'dashboard.reportListSection.reportCard.entries'
              )} ${packagingGroupsCount}`}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              textAlign: { md: 'right' },
              alignSelf: { md: 'flex-end' },
            }}
          >
            {isEditable && (
              <Typography variant={'body2'} color={'text.disabled'}>
                {t('dashboard.reportListSection.reportCard.editableUntil', {
                  endDate: formattedEndDate,
                })}
              </Typography>
            )}
          </Box>
        </Stack>
        {isEditable && (
          <Stack sx={{ mt: 10, display: { md: 'none' } }}>{editButton}</Stack>
        )}
      </Box>
    </Card>
  )
}
