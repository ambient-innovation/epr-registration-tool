import { useApolloClient } from '@apollo/client'
import React, { useState } from 'react'

import { useMeQuery } from '@/api/__types__'
import { handleError } from '@/utils/error.utils'

import { AuthContext, UserContext } from './UserContext'
import { loginAPI, logoutAPI } from './api'

export interface UserProvider {
  children: React.ReactNode
  defaultLoggedIn?: boolean
}

export const UserProvider = ({
  children,
}: UserProvider): React.ReactElement => {
  const client = useApolloClient()

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
    return logoutAPI()
      .catch((error) => handleError(error))
      .finally(() => {
        return client.resetStore()
      })
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
        }}
      >
        {children}
      </AuthContext.Provider>
    </UserContext.Provider>
  )
}
