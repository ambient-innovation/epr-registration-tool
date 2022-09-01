import { yupResolver } from '@hookform/resolvers/yup'
import {
  Alert,
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
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

import { COMPANY_DETAILS_WITH_CONTACT_INFO } from '@/accountSettings/components/AccountSettingsSection/ChangeCompanyData/queries'
import {
  CompanyDetailsWithContactInfoQuery,
  useChangeCompanyDetailsMutation,
  useCompanyDetailsWithContactInfoQuery,
  useUserAccountDataQuery,
} from '@/api/__types__'
import { getTitleOptions } from '@/auth/components/Registration/constants'
import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'
import { FormSubmitFooter } from '@/common/components/FormSubmitFooter'
import { SelectField } from '@/common/components/SelectField'
import { pxToRemAsString } from '@/theme/utils'
import { COUNTRY_OPTIONS } from '@/utils/form/countries'
import {
  emailValidator,
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
  identificationNumber: requiredStringWithoutWhitespace().nullable(),
  invoiceRecipientTitle: yup.string(),
  invoiceRecipientFullName: yup.string().when('useAdditionalInvoiceRecipient', {
    is: true,
    then: requiredStringValidator(),
    otherwise: yup.string(),
  }),
  invoiceRecipientEmail: yup.string().when('useAdditionalInvoiceRecipient', {
    is: true,
    then: emailValidator(),
    otherwise: yup.string(),
  }),
  invoiceRecipientPhoneOrMobile: yup
    .string()
    .when('useAdditionalInvoiceRecipient', {
      is: true,
      then: requiredStringValidator(),
      otherwise: yup.string(),
    }),
  useAdditionalInvoiceRecipient: yup.boolean(),
})

const resolver = yupResolver(schema)

interface ChangeCompanyDetailsForm {
  companyDetails: NonNullable<
    CompanyDetailsWithContactInfoQuery['companyDetails']
  >
  defaultPhoneNumber?: string
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

export const AdditionalInvoiceRecipientHeader = (): React.ReactElement => {
  const { t } = useTranslation()
  return (
    <header>
      <Typography component={'h2'} variant={'h3'}>
        {t('accountSettings.changeCompanyDataForm.additionalInvoiceRecipient')}
      </Typography>
      <Typography variant={'body1'} mt={{ xs: 5, sm: 6 }}>
        {t(
          'accountSettings.changeCompanyDataForm.additionalInvoiceRecipientDesc'
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
  defaultPhoneNumber,
}: ChangeCompanyDetailsForm): React.ReactElement => {
  const { t } = useTranslation()

  const [changeCompanyDetails, { error }] = useChangeCompanyDetailsMutation({
    refetchQueries: [COMPANY_DETAILS_WITH_CONTACT_INFO],
  })

  const isSubmittedSuccessfulRef = useRef(false)

  const defaultValues = useMemo<CompanyData>(
    () => ({
      name: companyDetails.name,
      distributorType: companyDetails.distributorType,
      identificationNumber: companyDetails.identificationNumber,
      country:
        companyDetails.contactInfo?.country ||
        COUNTRY_OPTIONS.find(
          (option) => option.value.toLowerCase() === companyDetails.countryCode
        )?.label ||
        '',
      city: companyDetails.contactInfo?.city || '',
      postalCode: companyDetails.contactInfo?.postalCode || '',
      street: companyDetails.contactInfo?.street || '',
      streetNumber: companyDetails.contactInfo?.streetNumber || '',
      additionalAddressInfo:
        companyDetails.contactInfo?.additionalAddressInfo || '',
      phoneNumber:
        companyDetails.contactInfo?.phoneNumber || defaultPhoneNumber || '',
      invoiceRecipientTitle:
        companyDetails?.additionalInvoiceRecipient?.title || '',
      invoiceRecipientFullName:
        companyDetails?.additionalInvoiceRecipient?.fullName || '',
      invoiceRecipientEmail:
        companyDetails?.additionalInvoiceRecipient?.email || '',
      invoiceRecipientPhoneOrMobile:
        companyDetails?.additionalInvoiceRecipient?.phoneOrMobile || '',
      useAdditionalInvoiceRecipient:
        !!companyDetails?.additionalInvoiceRecipient,
    }),
    [companyDetails, defaultPhoneNumber]
  )

  const { register, handleSubmit, formState, control, reset, watch } =
    useForm<CompanyData>({
      mode: 'onTouched',
      resolver,
      defaultValues,
    })
  const showAdditionalInvoiceRecipientFormSection = watch(
    'useAdditionalInvoiceRecipient'
  )
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
        additionalInvoiceRecipientInput:
          updatedData.useAdditionalInvoiceRecipient
            ? {
                title: updatedData.invoiceRecipientTitle,
                fullName: updatedData.invoiceRecipientFullName,
                email: updatedData.invoiceRecipientEmail,
                phoneOrMobile: updatedData.invoiceRecipientPhoneOrMobile,
              }
            : null,
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
            <Divider />
            <Controller
              control={control}
              name={'country'}
              render={({
                field: { onChange, ref, value },
                formState: { errors },
              }) => {
                return (
                  <Autocomplete
                    options={COUNTRY_OPTIONS}
                    onChange={(_, value) => {
                      onChange(value?.label)
                    }}
                    value={
                      COUNTRY_OPTIONS.find(
                        (option) => option.label === value
                      ) || null
                    }
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          inputRef={ref}
                          label={t(
                            'accountSettings.changeCompanyDataForm.companyCountry'
                          )}
                          InputLabelProps={{
                            // avoid moving label for required fields
                            shrink: !!defaultValues.country || undefined,
                          }}
                          error={!!errors?.country}
                          helperText={errorMsg(errors?.country?.message)}
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
        <AdditionalInvoiceRecipientHeader />
        <Box marginTop={{ xs: 9, md: 10 }}>
          <Stack spacing={DEFAULT_FORM_SPACING}>
            <Controller
              control={control}
              name={'useAdditionalInvoiceRecipient'}
              render={({ field: { onChange, ref, value } }) => (
                <FormControlLabel
                  control={<Checkbox />}
                  label={'Use additional invoice recipient'}
                  onChange={onChange}
                  ref={ref}
                  checked={showAdditionalInvoiceRecipientFormSection}
                  // make it controlled
                  value={
                    !!value
                      ? value
                      : defaultValues.useAdditionalInvoiceRecipient
                  }
                />
              )}
            />
            {showAdditionalInvoiceRecipientFormSection && (
              <>
                <Divider />
                <Stack
                  // for some reason the spacing does not work when only defining `sm`
                  direction={{ xs: 'column', sm: 'row', md: 'row' }}
                  spacing={DEFAULT_FORM_SPACING}
                >
                  <Controller
                    control={control}
                    name={'invoiceRecipientTitle'}
                    render={({
                      field: { onChange, ref, value },
                      formState: { errors },
                    }) => (
                      <SelectField
                        sx={{
                          width: { sm: pxToRemAsString(140) },
                        }}
                        label={t('accountSettings.editAccountForm.titleLabel')}
                        error={!!errors?.invoiceRecipientTitle}
                        helperText={errorMsg(
                          errors?.invoiceRecipientTitle?.message
                        )}
                        ref={ref}
                        defaultValue={defaultValues?.invoiceRecipientTitle}
                        options={getTitleOptions(t)}
                        value={value}
                        onChange={onChange}
                        fullWidth
                        required
                      />
                    )}
                  />
                  <TextField
                    label={t('accountSettings.editAccountForm.fullName')}
                    error={!!errors?.invoiceRecipientFullName}
                    helperText={errorMsg(
                      errors?.invoiceRecipientFullName?.message
                    )}
                    fullWidth
                    required
                    {...register('invoiceRecipientFullName')}
                  />
                </Stack>
                <TextField
                  label={t('accountSettings.editAccountForm.email')}
                  error={!!errors?.invoiceRecipientEmail}
                  helperText={errorMsg(errors?.invoiceRecipientEmail?.message)}
                  type={'email'}
                  required
                  dir={'ltr'} // email always written from left
                  {...register('invoiceRecipientEmail')}
                />
                <TextField
                  label={t('accountSettings.editAccountForm.phoneNumber')}
                  error={!!errors?.invoiceRecipientPhoneOrMobile}
                  helperText={errorMsg(
                    errors?.invoiceRecipientPhoneOrMobile?.message
                  )}
                  required
                  {...register('invoiceRecipientPhoneOrMobile')}
                />
              </>
            )}
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
          <ApolloErrorAlert
            title={t(
              'common:accountSettings.changeCompanyDataForm.updateFailed'
            )}
            error={error}
          />
        </Box>
      )}
      <FormSubmitFooter
        sx={formFooterSx}
        isSubmitting={formState.isSubmitting}
        buttonLabelKey={'accountSettings.submitChanges'}
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
  const { data: accountData } = useUserAccountDataQuery()
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
        <ChangeCompanyDetailsForm
          defaultPhoneNumber={accountData?.me?.phoneOrMobile}
          companyDetails={data.companyDetails}
        />
      )}
    </section>
  )
}
