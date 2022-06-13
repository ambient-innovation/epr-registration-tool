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
    .test(
      'len',
      'validations.passwordTooShort',
      (val) => !val || val.length >= 8
    )

export const requiredStringValidator = () =>
  yup.string().required('validations.required')

export const requiredDateValidator = () =>
  yup
    .date()

    .required('validations.required')

export const requiredStringWithoutWhitespace = () =>
  yup
    .string()
    .required('validations.required')
    .test('whitespaces', 'validations.noWhitespaceAllowed', (val) =>
      !!val ? !/\s/.test(val) : true
    )
