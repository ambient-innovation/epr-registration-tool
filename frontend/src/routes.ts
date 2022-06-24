export const ROUTES = {
  home: '/',
  // --- auth ----
  login: '/auth/login',
  registration: '/auth/registration',
  registrationSuccess: '/auth/registration/success',
  forgetPassword: '/auth/forget-password',
  resetPassword: '/auth/forget-password/reset',
  accountActivation: '/auth/activation',
  // --- dashboard ---
  dashboard: '/dashboard',
  dashboardComplete: 'dashboard/complete',
  // --- report ---
  forecast: '/report/forecast/add',
  forecastSuccess: '/report/forecast/add/success',
  packagingReportChange: (id: string): string => `/report/${id}/change`,
  forecastUpdateSuccess: (id: string): string =>
    `/report/${id}/change/update-success`,
  finalReportSubmitSuccess: (id: string): string =>
    `/report/${id}/change/final-success`,
  dataReportView: (id: string): string => `/report/${id}`,
  accountSettingsChangePassword: '/account-settings/change-password',
  accountSettingsChangeLanguage: '/account-settings/change-language',
}
