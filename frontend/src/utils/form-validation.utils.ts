import * as yup from 'yup'

export const emailValidator = () =>
  yup
    .string()
    .required('validations.required')
    .email('validations.emailInvalid')

export const passwordValidator = () =>
  yup
    .string()
    .required('Please enter a password')
    .matches(/[A-Z]/, 'validations.passwordMustHaveUppercase')
    .matches(/[a-z]/, 'validations.passwordMustHaveLowercase')
    .matches(/\d/, 'validations.passwordMustHaveOneNumber')
    .matches(
      /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
      'validations.passwordMustHaveSpecialCharacter'
    )
    .test('len', 'validations.passwordLength', (val) => !val || val.length > 9)

export const companyRegistrationNumberValidator = () =>
  yup
    .string()
    .required('validations.required')
    .test(
      'len',
      'validations.registrationNumberLength',
      (val) => val?.length === 9
    )

export const requiredStringValidator = () =>
  yup.string().required('validations.required')
