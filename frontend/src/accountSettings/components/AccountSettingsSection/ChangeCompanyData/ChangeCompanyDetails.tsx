import { yupResolver } from '@hookform/resolvers/yup'
import {
  Alert,
  Autocomplete,
  Box,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useMemo, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { SchemaOf } from 'yup'

import {
  CompanyDetailsWithContactInfoDocument,
  CompanyDetailsWithContactInfoQuery,
  useChangeCompanyDetailsMutation,
  useCompanyDetailsWithContactInfoQuery,
} from '@/api/__types__'
import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'
import { FormSubmitFooter } from '@/common/components/FormSubmitFooter'
import {
  requiredStringValidator,
  requiredStringWithoutWhitespace,
} from '@/utils/form/form-validation.utils'
import { getTranslatedOptions } from '@/utils/translation.utils'

import {
  formBackgroundSx,
  formFooterSx,
} from '../AccountSettingsSection.styles'
import { DISTRIBUTOR_TYPE_MAP } from './constants'
import { CompanyData } from './types'

const schema: SchemaOf<Record<keyof CompanyData, unknown>> = yup.object({
  name: requiredStringValidator(),
  distributorType: requiredStringValidator(),
  country: requiredStringValidator(),
  postalCode: yup.string(),
  city: requiredStringValidator(),
  street: requiredStringValidator(),
  streetNumber: yup.string(),
  phoneNumber: requiredStringValidator(),
  additionalAddressInfo: yup.string(),
  identificationNumber: requiredStringWithoutWhitespace(),
})

const resolver = yupResolver(schema)

interface ChangeCompanyDetailsForm {
  companyDetails: NonNullable<
    CompanyDetailsWithContactInfoQuery['companyDetails']
  >
}

export const TaxNumberHeader = (): React.ReactElement => {
  const { t } = useTranslation()
  return (
    <header>
      <Typography component={'h2'} variant={'h3'}>
        {t(
          'accountSettings.changeCompanyDataForm.companyIdentificationNumber.title'
        )}
      </Typography>
      <Typography variant={'body1'} mt={{ xs: 5, sm: 6 }}>
        {t(
          'accountSettings.changeCompanyDataForm.companyIdentificationNumber.description'
        )}
      </Typography>
    </header>
  )
}

export const CompanyDataHeader = (): React.ReactElement => {
  const { t } = useTranslation()
  return (
    <header>
      <Typography component={'h2'} variant={'h3'}>
        {t('accountSettings.changeCompanyDataForm.title')}
      </Typography>
      <Typography variant={'body1'} mt={{ xs: 5, sm: 6 }}>
        {t('accountSettings.changeCompanyDataForm.description')}
      </Typography>
    </header>
  )
}

const ChangeCompanyDetailsForm = ({
  companyDetails,
}: ChangeCompanyDetailsForm): React.ReactElement => {
  const { t } = useTranslation()

  const [changeCompanyDetails, { error }] = useChangeCompanyDetailsMutation({
    refetchQueries: [{ query: CompanyDetailsWithContactInfoDocument }],
  })

  const isSubmittedSuccessfulRef = useRef(false)

  const defaultValues = useMemo<CompanyData>(
    () => ({
      name: companyDetails.name,
      distributorType: companyDetails.distributorType,
      identificationNumber: companyDetails.identificationNumber,
      country: companyDetails.contactInfo?.country || '',
      city: companyDetails.contactInfo?.city || '',
      postalCode: companyDetails.contactInfo?.postalCode || '',
      street: companyDetails.contactInfo?.street || '',
      streetNumber: companyDetails.contactInfo?.streetNumber || '',
      additionalAddressInfo:
        companyDetails.contactInfo?.additionalAddressInfo || '',
      phoneNumber: companyDetails.contactInfo?.phoneNumber || '',
    }),
    [companyDetails]
  )

  const { register, handleSubmit, formState, control, reset } =
    useForm<CompanyData>({
      mode: 'onTouched',
      resolver,
      defaultValues,
    })

  useEffect(() => {
    // reset form when data is re-fetched
    // (check for formState to prevent reset on initial render)
    if (formState.isSubmitSuccessful) {
      reset(defaultValues)
    }
    // explicitly exclude `formState` from dependencies
    // --> only reset form when defaultValues change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, reset])

  const { errors } = formState
  const errorMsg = (translationKey: string | undefined): string | undefined =>
    translationKey && (t(translationKey) as string)

  const onSubmit = (updatedData: CompanyData) => {
    return changeCompanyDetails({
      variables: {
        companyInput: {
          name: updatedData.name,
          distributorType: updatedData.distributorType,
          identificationNumber: updatedData.identificationNumber,
        },
        contactInfoInput: {
          country: updatedData.country,
          postalCode: updatedData.postalCode,
          city: updatedData.city,
          street: updatedData.street,
          streetNumber: updatedData.streetNumber,
          additionalAddressInfo: updatedData.additionalAddressInfo,
          phoneNumber: updatedData.phoneNumber,
        },
      },
    }).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  if (formState.isSubmitSuccessful) {
    // avoid submission state turning back on form reset()
    isSubmittedSuccessfulRef.current = true
  }

  return (
    <form
      // do not propagate errors --> display error
      onSubmit={(e) => handleSubmit(onSubmit)(e).catch(() => null)}
      noValidate
    >
      {!formState.isDirty && isSubmittedSuccessfulRef.current && (
        <Box sx={{ mb: 8, px: { xs: 6, md: 0 } }}>
          <Alert
            sx={{ alignItems: 'center' }}
            variant={'filled'}
            severity={'success'}
          >
            <Typography variant={'body2'}>
              {t('accountSettings.changeCompanyDataForm.updateSuccessMessage')}
            </Typography>
          </Alert>
        </Box>
      )}
      <Box component={'section'} sx={formBackgroundSx}>
        <CompanyDataHeader />
        <Box marginTop={{ xs: 9, md: 10 }}>
          <Stack spacing={DEFAULT_FORM_SPACING}>
            <TextField
              label={t('accountSettings.changeCompanyDataForm.companyName')}
              InputLabelProps={{
                // avoid moving label for required fields
                shrink: !!defaultValues.name || undefined,
              }}
              error={!!errors?.name}
              helperText={errorMsg(errors?.name?.message)}
              fullWidth
              required
              {...register('name')}
            />
            <Controller
              control={control}
              name={'distributorType'}
              render={({
                field: { onChange, ref, value },
                formState: { errors },
              }) => {
                const distributorOptions = getTranslatedOptions(
                  DISTRIBUTOR_TYPE_MAP,
                  t
                )
                return (
                  <Autocomplete
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    options={distributorOptions}
                    onChange={(_, value) => {
                      onChange(value?.value)
                    }}
                    value={
                      distributorOptions.find(
                        (option) => option.value === value
                      ) || null
                    }
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          inputRef={ref}
                          label={t(
                            'accountSettings.changeCompanyDataForm.companyDistributorType.label'
                          )}
                          InputLabelProps={{
                            // avoid moving label for required fields
                            shrink:
                              !!defaultValues.distributorType || undefined,
                          }}
                          error={!!errors?.distributorType}
                          helperText={errorMsg(
                            errors?.distributorType?.message
                          )}
                          fullWidth
                          required
                        />
                      )
                    }}
                  />
                )
              }}
            />
            <TextField
              label={t('accountSettings.changeCompanyDataForm.companyCountry')}
              InputLabelProps={{
                // avoid moving label for required fields
                shrink: !!defaultValues.country || undefined,
              }}
              error={!!errors?.country}
              helperText={errorMsg(errors?.country?.message)}
              fullWidth
              required
              {...register('country')}
            />

            <TextField
              label={t(
                'accountSettings.changeCompanyDataForm.companyPostalCode'
              )}
              InputLabelProps={{
                // avoid moving label for required fields
                shrink: !!defaultValues.postalCode || undefined,
              }}
              error={!!errors?.postalCode}
              helperText={errorMsg(errors?.postalCode?.message)}
              fullWidth
              {...register('postalCode')}
            />

            <TextField
              label={t('accountSettings.changeCompanyDataForm.companyCity')}
              InputLabelProps={{
                // avoid moving label for required fields
                shrink: !!defaultValues.city || undefined,
              }}
              error={!!errors?.city}
              helperText={errorMsg(errors?.city?.message)}
              required
              fullWidth
              {...register('city')}
            />
            <TextField
              label={t('accountSettings.changeCompanyDataForm.companyStreet')}
              InputLabelProps={{
                // avoid moving label for required fields
                shrink: !!defaultValues.street || undefined,
              }}
              error={!!errors?.street}
              helperText={errorMsg(errors?.street?.message)}
              required
              fullWidth
              {...register('street')}
            />
            <TextField
              label={t(
                'accountSettings.changeCompanyDataForm.companyStreetNumber'
              )}
              InputLabelProps={{
                // avoid moving label for required fields
                shrink: !!defaultValues.streetNumber || undefined,
              }}
              error={!!errors?.streetNumber}
              helperText={errorMsg(errors?.streetNumber?.message)}
              fullWidth
              {...register('streetNumber')}
            />
            <TextField
              label={t(
                'accountSettings.changeCompanyDataForm.companyAdditionalAddressInfo'
              )}
              InputLabelProps={{
                // avoid moving label for required fields
                shrink: !!defaultValues.additionalAddressInfo || undefined,
              }}
              error={!!errors?.additionalAddressInfo}
              helperText={errorMsg(errors?.additionalAddressInfo?.message)}
              fullWidth
              multiline
              {...register('additionalAddressInfo')}
            />
            <TextField
              label={t(
                'accountSettings.changeCompanyDataForm.companyPhoneNumber.label'
              )}
              InputLabelProps={{
                // avoid moving label for required fields
                shrink: !!defaultValues.phoneNumber || undefined,
              }}
              error={!!errors?.phoneNumber}
              helperText={
                !!errors?.phoneNumber
                  ? errorMsg(errors?.phoneNumber?.message)
                  : t(
                      'accountSettings.changeCompanyDataForm.companyPhoneNumber.hint'
                    )
              }
              required
              fullWidth
              {...register('phoneNumber')}
            />
          </Stack>
        </Box>
      </Box>
      <Box component={'section'} sx={formBackgroundSx} mt={8}>
        <TaxNumberHeader />
        <Box marginTop={{ xs: 9, md: 10 }}>
          <TextField
            label={t(
              'accountSettings.changeCompanyDataForm.companyIdentificationNumber.number'
            )}
            InputLabelProps={{
              // avoid moving label for required fields
              shrink: !!defaultValues.identificationNumber || undefined,
            }}
            error={!!errors?.identificationNumber}
            helperText={errorMsg(errors?.identificationNumber?.message)}
            required
            fullWidth
            {...register('identificationNumber')}
          />
        </Box>
      </Box>
      {error && (
        <Box mt={5}>
          <ApolloErrorAlert error={error} />
        </Box>
      )}
      <FormSubmitFooter
        sx={formFooterSx}
        isSubmitting={formState.isSubmitting}
        buttonLabelKey={'accountSettings.changeCompanyDataForm.submitChanges'}
      />
    </form>
  )
}

const LoadingState = (): React.ReactElement => {
  return (
    <Box sx={formBackgroundSx}>
      <CompanyDataHeader />
      <Stack mt={8} spacing={DEFAULT_FORM_SPACING}>
        {new Array(8).fill(null).map((_, index) => (
          <Skeleton key={index} variant={'rectangular'} sx={{ height: 56 }} />
        ))}
      </Stack>
    </Box>
  )
}

export const ChangeCompanyDetails = (): React.ReactElement => {
  const { loading, data } = useCompanyDetailsWithContactInfoQuery()
  const { t } = useTranslation()
  return (
    <section>
      {loading ? (
        <LoadingState />
      ) : !data?.companyDetails ? (
        <Alert severity={'warning'}>
          {t('common:accountSettings.changeCompanyDataForm.noCompanyAssigned')}
        </Alert>
      ) : (
        <ChangeCompanyDetailsForm companyDetails={data.companyDetails} />
      )}
    </section>
  )
}
