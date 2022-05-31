export const DontResolvePromise = (): Promise<void> =>
  new Promise<void>(() => null)

export const ErrorPromise = (): Promise<void> =>
  new Promise<void>(() => {
    throw new Error('Missing provider for AuthContext')
  })
