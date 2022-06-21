export const ROUTES = {
  home: '/',
  login: '/login',
  registration: '/registration',
  registrationSuccess: '/registration/success',
  dashboard: '/dashboard',
  dashboardComplete: 'dashboard/complete',
  accountActivation: '/auth/activation',
  forecast: '/report/forecast/add',
  forecastSuccess: '/report/forecast/add/success',
  forecastChange: (id: string): string => `/report/forecast/${id}/change`,
  forecastUpdateSuccess: (id: string): string =>
    `/report/forecast/${id}/change/success`,
}
