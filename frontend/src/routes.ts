export const ROUTES = {
  home: '/',
  login: '/login',
  registration: '/registration',
  registrationSuccess: '/registration/success',
  dashboard: '/dashboard',
  dashboardComplete: 'dashboard/complete',
  accountActivation: '/auth/activation',
  forecast: '/report/forecast/add',
  forecastChange: (id: string): string => `/report/forecast/${id}/change`,
  forecastSuccess: '/report/forecast/add/success',
}
