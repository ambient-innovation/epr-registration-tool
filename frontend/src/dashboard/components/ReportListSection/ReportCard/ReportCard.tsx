import { Card, Chip, Typography, Box, Stack, Button } from '@mui/material'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { DjangoFileType, PackagingReportType } from '@/api/__types__'
import { timeframeDisplayValue } from '@/common/contants'
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
  | 'isForecastEditable'
  | 'isFinalReportSubmitted'
  | 'fees'
  | 'isPaid'
  | 'endDatetime'
> & { invoiceFile?: Pick<DjangoFileType, 'url'> | null }

export const ReportCard = ({
  id: reportId,
  createdAt,
  startMonth,
  year,
  timeframe,
  packagingGroupsCount,
  isForecastEditable,
  isFinalReportSubmitted,
  endDatetime,
  fees,
  isPaid,
  invoiceFile,
}: ReportCard): React.ReactElement => {
  const { t } = useTranslation()
  const { locale } = useRouter()

  const startDate = new Date(year, startMonth - 1, 1)
  const formattedStartDate = startDate.toLocaleDateString()
  const formattedSubmitDate = new Date(createdAt).toLocaleDateString()
  // forecast is editable until end date
  const formattedEndDate = new Date(endDatetime).toLocaleDateString()

  const statusChip = (
    <Chip
      label={
        isFinalReportSubmitted
          ? isPaid
            ? 'paid'
            : 'Payment required'
          : t('dashboard.reportListSection.reportCard.forecast')
      }
      sx={{
        ...statusChipSx,
        backgroundColor: isFinalReportSubmitted
          ? isPaid
            ? 'success.main'
            : 'warning.main'
          : 'info.main',
      }}
      role={'listitem'}
    />
  )
  const actionButton = isForecastEditable ? (
    <NextLink href={ROUTES.packagingReportChange(reportId)} passHref>
      <Button component={'a'} variant={'contained'}>
        {t('edit')}
      </Button>
    </NextLink>
  ) : !isFinalReportSubmitted ? (
    <NextLink href={ROUTES.packagingReportChange(reportId)} passHref>
      <Button component={'a'} variant={'contained'}>
        {t('dashboard.reportListSection.reportCard.submitActualQuantities')}
      </Button>
    </NextLink>
  ) : (
    <>
      <NextLink href={ROUTES.dataReportView(reportId)} passHref>
        <Button component={'a'} variant={'outlined'}>
          {t('dashboard.reportListSection.reportCard.view')}
        </Button>
      </NextLink>
      {invoiceFile && (
        <Button
          component={'a'}
          variant={'outlined'}
          target={'_blank'}
          href={invoiceFile.url}
        >
          {t('dashboard.reportListSection.reportCard.viewInvoice')}
        </Button>
      )}
    </>
  )

  const reportNumber = reportId

  return (
    <Card sx={{ boxShadow: 11, borderRadius: 3 }}>
      <Box sx={cardContentSx}>
        <Box
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Typography variant={'h3'}>
            {t('dashboard.reportListSection.reportCard.title', {
              reportNumber,
            })}
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>{statusChip}</Box>
          <Stack
            direction={'row'}
            sx={{ ml: 'auto', display: { xs: 'none', md: 'block' } }}
            spacing={6}
          >
            {actionButton}
          </Stack>
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
              {t('dashboard.reportListSection.reportCard.startsAt')}{' '}
              <Typography component={'span'} variant={'subtitle2'}>
                {formattedStartDate}
              </Typography>
            </Typography>
            <Typography variant={'body2'}>
              {t('dashboard.reportListSection.reportCard.timeframe')}{' '}
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
            {fees && (
              <Typography variant={'body2'}>
                {t('dashboard.reportListSection.reportCard.calculatedFees')}{' '}
                <Typography component={'span'} variant={'subtitle2'}>
                  {`${new Intl.NumberFormat(
                    locale == 'ar' ? 'ar-JO' : 'en-GB',
                    {
                      minimumFractionDigits: 2,
                    }
                  ).format(fees)} ${t('currency')}`}
                </Typography>
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              flex: 1,
              textAlign: { md: 'right' },
              alignSelf: { md: 'flex-end' },
            }}
          >
            {isForecastEditable && (
              <Typography variant={'body2'} color={'text.disabled'}>
                {t('dashboard.reportListSection.reportCard.editableUntil', {
                  endDate: formattedEndDate,
                })}
              </Typography>
            )}
          </Box>
        </Stack>
        <Stack sx={{ mt: 10, display: { md: 'none' } }} spacing={6}>
          {actionButton}
        </Stack>
      </Box>
    </Card>
  )
}
