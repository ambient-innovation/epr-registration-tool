import { LanguageEnum, UserType } from '@/api/__types__'

export const mockUser: UserType = {
  id: '1',
  fullName: 'Chuck Norris',
  email: 'chuck.norris@example.com',
  title: 'mr',
  languagePreference: LanguageEnum.en,
}
