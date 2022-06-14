import { Alert, Box, Grid, Skeleton, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { Fragment } from 'react'

import { CompanyType, useCompanyDetailsQuery } from '@/api/__types__'
import { useUser } from '@/auth/hooks/useUser'
import { CompletionAlert } from '@/dashboard/components/Dashboard/CompletionAltert'
import { DashboardHeader } from '@/dashboard/components/Dashboard/DashboardHeader'
import { ReportListSection } from '@/dashboard/components/ReportListSection'
import { defaultContainerSx } from '@/theme/layout'
import { fontWeights } from '@/theme/typography'

import { distributorTypes } from './constants'

export type Dashboard = Record<string, never>
export interface BaseData {
  companyInformation: CompanyType
}

const BaseData = ({ companyInformation }: BaseData): React.ReactElement => {
  const { t } = useTranslation()
  const { name, ...companyBaseData } = companyInformation
  const preparedData = {
    registrationNumber: companyBaseData.identificationNumber || 'Not set',
    distributorType: distributorTypes(t)[companyBaseData.distributorType],
    createdAt: new Date(companyBaseData.createdAt).toLocaleDateString(),
    lastmodifiedAt: new Date(
      companyBaseData.lastmodifiedAt
    ).toLocaleDateString(),
  }

  return (
    <>
      <Typography variant={'h5'}>{name}</Typography>
      <Grid container sx={{ mt: 6 }}>
        {Object.entries(preparedData).map(([key, value]) => (
          <Fragment key={key}>
            <Grid item xs={6} md={3}>
              <Typography>{`${t(`dashboard.${key}`)}:`}</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography fontWeight={fontWeights.bold}>{value}</Typography>
            </Grid>
          </Fragment>
        ))}
      </Grid>
    </>
  )
}

export const Dashboard = (_: Dashboard): React.ReactElement => {
  const { t } = useTranslation()
  const { data, loading } = useCompanyDetailsQuery()
  const companyDetails = data?.companyDetails
  const { user } = useUser()

  const canAddReport = !!companyDetails?.isProfileCompleted

  return (
    <>
      <Box sx={defaultContainerSx}>
        {!loading && !canAddReport && <CompletionAlert />}
        <DashboardHeader user={user} canAddReport={canAddReport} />
        <Box sx={{ marginTop: 11 }}>
          {loading ? (
            <Skeleton
              variant={'rectangular'}
              sx={{ height: { xs: 140, md: 95 } }}
            />
          ) : companyDetails ? (
            <BaseData companyInformation={companyDetails} />
          ) : (
            <Alert severity={'warning'}>
              {t('dashboard.noCompanyAssigned')}
            </Alert>
          )}
        </Box>
      </Box>
      <Box mt={11}>
        <ReportListSection canAddReport={canAddReport} />
      </Box>
    </>
  )
}
