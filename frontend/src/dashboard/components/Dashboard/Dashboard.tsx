import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { CompanyType, useCompanyDetailsQuery } from '@/api/__types__'
import { useUser } from '@/auth/hooks/useUser'
import { PageLayout } from '@/common/components/PageLayout'
import { DashboardHeader } from '@/dashboard/components/Dashboard/DashboardHeader'
import { containerCss } from '@/homepage/components/Homepage/Homepage.styles'
import { fontWeights } from '@/theme/typography'

import { dateFormat, distributorTypes } from './constants'

export type Dashboard = Record<string, never>
export interface BaseData {
  companyInformation: CompanyType
}

const BaseData = ({ companyInformation }: BaseData): React.ReactElement => {
  const { t } = useTranslation()
  const { name, ...companyBaseData } = companyInformation
  const preparedData = [
    {
      registrationNumber: companyBaseData.registrationNumber
        ? companyBaseData.registrationNumber
        : 'Not set',
      distributorType: distributorTypes(t)[companyBaseData.distributorType],
    },
    {
      createdAt: new Date(companyBaseData.createdAt).toLocaleString(
        'en-GB',
        dateFormat
      ),
      lastmodifiedAt: new Date(companyBaseData.lastmodifiedAt).toLocaleString(
        'en-GB',
        dateFormat
      ),
    },
  ]
  return (
    <Box sx={{ marginTop: 11 }}>
      <Typography variant={'h5'}>{name}</Typography>
      <Stack direction={'row'} sx={{ marginTop: 6 }} spacing={15}>
        {preparedData.map((column) => (
          <Box key={column.toString()}>
            {Object.entries(column).map(([key, value]) => (
              <Stack
                sx={{ minWidth: '25vw' }}
                justifyContent={'space-between'}
                key={key}
                direction={'row'}
              >
                <Typography>{`${t(`dashboard.${key}`)}:`}</Typography>
                <Typography fontWeight={fontWeights.bold}>{value}</Typography>
              </Stack>
            ))}
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

export const Dashboard = (_: Dashboard): React.ReactElement => {
  const { t } = useTranslation()
  const { data, loading } = useCompanyDetailsQuery()
  const companyDetails = data && data.companyDetails
  const { user } = useUser()

  if (!user) {
    return (
      <PageLayout>
        <Typography variant={'h1'}>{t('dashboard.pleaseLogin')}</Typography>
      </PageLayout>
    )
  }
  return (
    <Box sx={containerCss}>
      <DashboardHeader userName={`${user.title} ${user.fullName}`} />
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
