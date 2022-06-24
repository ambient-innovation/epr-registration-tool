import { FC, useContext } from 'react'

import {
  AuthContext,
  AuthContextValue,
  UserContext,
  UserContextValue,
} from './UserContext'
import { DontResolvePromise } from './utils'

export type ChildrenType = {
  children: React.ReactNode
}

export type MockUserProps = Partial<
  UserContextValue & AuthContextValue & ChildrenType
>

export const MockUserProvider: FC<MockUserProps> = ({
  children,
  ...testContext
}) => {
  const { user, ...context } = testContext || { user: null }

  return (
    <UserContext.Provider value={{ user: user || null }}>
      <AuthContext.Provider
        value={{
          loading: false,
          login: DontResolvePromise,
          loggedIn: !!user,
          setLoggedIn: DontResolvePromise,
          logout: DontResolvePromise,
          activate: DontResolvePromise,
          requestPasswordReset: DontResolvePromise,
          resetPassword: DontResolvePromise,
          ...context,
        }}
      >
        {children}
      </AuthContext.Provider>
    </UserContext.Provider>
  )
}

export const useUser: () => UserContextValue & AuthContextValue = () => ({
  ...useContext(UserContext),
  ...useContext(AuthContext),
})
