import { Box, Grid, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { Fragment } from 'react'

import { CompanyType, useCompanyDetailsQuery } from '@/api/__types__'
import { useUser } from '@/auth/hooks/useUser'
import { CompletionAlert } from '@/dashboard/components/Dashboard/CompletionAltert'
import { DashboardHeader } from '@/dashboard/components/Dashboard/DashboardHeader'
import { containerCss } from '@/homepage/components/Homepage/Homepage.styles'
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
    registrationNumber: companyBaseData.registrationNumber
      ? companyBaseData.registrationNumber
      : 'Not set',
    distributorType: distributorTypes(t)[companyBaseData.distributorType],
    createdAt: new Date(companyBaseData.createdAt).toLocaleDateString(),
    lastmodifiedAt: new Date(
      companyBaseData.lastmodifiedAt
    ).toLocaleDateString(),
  }

  return (
    <Box sx={{ marginTop: 11 }}>
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
    </Box>
  )
}

export const Dashboard = (_: Dashboard): React.ReactElement => {
  const { t } = useTranslation()
  const { data, loading } = useCompanyDetailsQuery()
  const companyDetails = data && data.companyDetails
  const { user } = useUser()

  return (
    <Box sx={containerCss}>
      <CompletionAlert />
      <DashboardHeader
        userName={`${user?.title} ${user?.fullName}`}
        isReportButtonEnabled={true}
      />
      {loading ? (
        <Typography>{'loading...'}</Typography>
      ) : companyDetails ? (
        <BaseData companyInformation={companyDetails} />
      ) : (
        <Typography variant={'h2'}>
          {t('dashboard.noCompanyAssigned')}
        </Typography>
      )}
    </Box>
  )
}
