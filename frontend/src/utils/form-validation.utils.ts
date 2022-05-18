import * as yup from 'yup'

export const emailValidator = () =>
  yup
    .string()
    .required('This field is required')
    .email('Please enter a valid e-mail address')

export const passwordValidator = () =>
  yup
    .string()
    .required('Please enter a password')
    .matches(/[A-Z]/, 'The password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'The password must contain at least one lowercase letter')
    .matches(/\d/, 'The password must contain at least one number')
    .matches(
      /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
      'The password must contain at least one special character, e.g., ! @ # ? ]'
    )
    .test(
      'len',
      'The password must be longer than 8 characters',
      (val) => !val || val.length > 9
    )

export const companyRegistrationNumberValidator = () =>
  yup
    .string()
    .required('This field is required')
    .test(
      'len',
      'The registration number must consist of 8 digits',
      (val) => val?.length === 9
    )

export const requiredStringValidator = () =>
  yup.string().required('This field is required')
