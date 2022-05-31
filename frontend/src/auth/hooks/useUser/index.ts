import { useContext } from 'react'

import { MockUserProvider } from './MockUserProvider'
import {
  AuthContext,
  AuthContextValue,
  UserContext,
  UserContextValue,
} from './UserContext'
import { UserProvider } from './UserProvider'

const useUser: () => UserContextValue & AuthContextValue = () => ({
  ...useContext(UserContext),
  ...useContext(AuthContext),
})

export { UserContext, AuthContext, UserProvider, MockUserProvider, useUser }
