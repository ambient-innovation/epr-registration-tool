/**
 * Typesafe pick function
 * Source: https://stackoverflow.com/a/47232883
 * */
import { DocumentNode } from 'graphql'

export const pick = <T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> => {
  const ret: any = {}
  keys.forEach((key) => {
    ret[key] = obj[key]
  })
  return ret
}

/**
 * Utility type for creating typesafe apollo mocks
 *
 * Example:
 * const mock: ApolloMock<MyQuery, MyQueryVariables> = ...
 *
 * Warning: The variables must exactly match the variables from the
 *   useQuery hook to be working as a mock response
 * */
export type ApolloMock<DataType, VariablesType> = {
  // Use `delay` parameter to increase loading time
  delay?: number
  request: {
    query: DocumentNode
    variables: VariablesType
  }
  result: {
    data?: null | DataType
  }
}
