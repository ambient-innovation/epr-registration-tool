export const ROUTES = {
  home: '/',
  // --- auth ----
  login: '/auth/login',
  registration: '/auth/registration',
  registrationSuccess: '/auth/registration/success',
  forgetPassword: '/auth/forget-password',
  resetPassword: '/auth/forget-password/reset',
  accountActivation: '/auth/activation',
  accountActivationComplete: '/auth/activation/complete',
  // --- dashboard ---
  dashboard: '/dashboard',
  // --- report ---
  forecast: '/report/forecast/add',
  forecastSuccess: '/report/forecast/add/success',
  packagingReportChange: (id: string): string => `/report/${id}/change`,
  forecastUpdateSuccess: (id: string): string =>
    `/report/${id}/change/update-success`,
  finalReportSubmitSuccess: (id: string): string =>
    `/report/${id}/change/final-success`,
  dataReportView: (id: string): string => `/report/${id}`,
  // --- account & settings ---
  accountSettingsChangePassword: '/account-settings/change-password',
  accountSettingsChangeLanguage: '/account-settings/change-language',
  accountSettingsChangeCompanyData: '/account-settings/change-company-data',
  // --- cms ----
  cmsPage: (slug: string) => `/${slug}`,
  previewApi: '/api/preview',
  stopPreviewApi: '/api/stop-preview',
}
