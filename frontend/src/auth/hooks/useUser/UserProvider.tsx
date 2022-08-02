import { useApolloClient } from '@apollo/client'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import { useMeQuery } from '@/api/__types__'
import { ROUTES } from '@/routes'
import { handleError } from '@/utils/error.utils'

import { AuthContext, UserContext } from './UserContext'
import {
  loginAPI,
  logoutAPI,
  activateEmailAddressAPI,
  sendPWResetEmailAPI,
  resetPasswordAPI,
} from './api'

export interface UserProvider {
  children: React.ReactNode
  defaultLoggedIn?: boolean
}

export const UserProvider = ({
  children,
}: UserProvider): React.ReactElement => {
  const client = useApolloClient()
  const router = useRouter()

  const [loggedIn, setLoggedIn] = useState(false)
  const { data: userData, loading: userLoading } = useMeQuery()

  const user = userData?.me ?? null

  const _setLoggedIn = (newLoggedIn: boolean): Promise<unknown> => {
    setLoggedIn(newLoggedIn)
    // resetStore will reset all graphql queries including the user query
    return client.resetStore()
  }

  const login: (
    userIdentifier: string,
    password: string,
    rememberMe: boolean
  ) => Promise<unknown> = (userIdentifier, password, rememberMe) => {
    return loginAPI(userIdentifier, password, rememberMe).then((data) => {
      return _setLoggedIn(!!data?.user)
    })
  }

  const logout = () => {
    setLoggedIn(false)
    return (
      logoutAPI()
        // bring user to home page instead of login page, as ProtectedPage does
        .then(() => router.push(ROUTES.home))
        .catch((error) => handleError(error))
        .finally(() => {
          return client.resetStore()
        })
    )
  }

  return (
    <UserContext.Provider
      value={{
        user,
      }}
    >
      <AuthContext.Provider
        value={{
          // prevent the following combination : loggedIn=true + userLoading=false + user=null
          loading: loggedIn ? !user : userLoading,
          login,
          loggedIn: !!user || loggedIn,
          logout,
          setLoggedIn: _setLoggedIn,
          activate: activateEmailAddressAPI,
          requestPasswordReset: sendPWResetEmailAPI,
          resetPassword: resetPasswordAPI,
        }}
      >
        {children}
      </AuthContext.Provider>
    </UserContext.Provider>
  )
}
