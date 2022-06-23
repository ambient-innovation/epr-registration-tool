export const ROUTES = {
  home: '/',
  login: '/login',
  registration: '/registration',
  registrationSuccess: '/registration/success',
  dashboard: '/dashboard',
  dashboardComplete: 'dashboard/complete',
  accountActivation: '/auth/activation',
  forgetPassword: '/auth/forget-password',
  resetPassword: '/auth/forget-password/reset',
  forecast: '/report/forecast/add',
  forecastSuccess: '/report/forecast/add/success',
  packagingReportChange: (id: string): string => `/report/${id}/change`,
  forecastUpdateSuccess: (id: string): string =>
    `/report/${id}/change/update-success`,
  finalReportSubmitSuccess: (id: string): string =>
    `/report/${id}/change/final-success`,
  dataReportView: (id: string): string => `/report/${id}`,
}
