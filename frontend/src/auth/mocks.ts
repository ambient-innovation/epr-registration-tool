import { LanguageEnum } from '@/api/__types__'

import { UserMeType } from './hooks/useUser/UserContext'

export const mockUser: UserMeType = {
  id: '1',
  fullName: 'Chuck Norris',
  email: 'chuck.norris@example.com',
  title: 'mr',
  languagePreference: LanguageEnum.en,
}
