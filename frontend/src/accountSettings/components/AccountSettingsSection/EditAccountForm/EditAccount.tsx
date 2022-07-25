import { Box, Skeleton, Stack } from '@mui/material'
import React, { useMemo } from 'react'

import { formBackgroundSx } from '@/accountSettings/components/AccountSettingsSection/AccountSettingsSection.styles'
import {
  useChangeAccountMutation,
  useUserAccountDataQuery,
} from '@/api/__types__'
import { useUser } from '@/auth/hooks/useUser'
import { USER_ACCOUNT_DATA } from '@/auth/queries/me'
import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'

import { EditAccountForm, EditAccountFormHeader } from './EditAccountForm'
import { EditAccountData } from './types'

const LoadingState = (): React.ReactElement => (
  <Box sx={formBackgroundSx}>
    <Stack mt={4} spacing={DEFAULT_FORM_SPACING}>
      <EditAccountFormHeader />
      {new Array(4).fill(null).map((_, index) => (
        <Skeleton key={index} variant={'rectangular'} sx={{ height: 56 }} />
      ))}
    </Stack>
  </Box>
)

export const EditAccount = () => {
  const { user } = useUser()
  const { data, loading, error: dataError } = useUserAccountDataQuery()
  const userAccountData = data?.me

  const emailChangeRequest = data?.me?.emailChangeRequest ?? undefined
  const defaultValues: EditAccountData | undefined = useMemo(
    () =>
      userAccountData
        ? {
            email: emailChangeRequest?.isValid
              ? emailChangeRequest.email
              : userAccountData?.email,
            fullName: userAccountData?.fullName,
            phoneOrMobile: userAccountData?.phoneOrMobile || '',
            title: userAccountData?.title || '',
            position: userAccountData?.position || '',
          }
        : undefined,
    [userAccountData, emailChangeRequest]
  )

  const [changeAccountMutation, { error }] = useChangeAccountMutation({
    refetchQueries: [USER_ACCOUNT_DATA],
  })

  const onSubmit = (accountData: EditAccountData) =>
    changeAccountMutation({
      variables: {
        accountData,
      },
    })

  if (dataError) {
    return <ApolloErrorAlert error={dataError} />
  }

  // !defaultValues so we mount the form when the data are ready.
  return (!user && loading) || !defaultValues ? (
    <LoadingState />
  ) : (
    <EditAccountForm
      defaultValues={defaultValues}
      emailChangeRequest={emailChangeRequest}
      onSubmit={onSubmit}
      error={error}
    />
  )
}
