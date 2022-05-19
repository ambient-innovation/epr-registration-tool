import { MockedProvider } from '@apollo/client/testing'

import { render, cleanup } from '@/utils/test.utils'

import { Homepage } from './Homepage'

afterEach(cleanup)

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      query: '',
      locale: 'en',
    }
  },
}))

describe('Homepage', () => {
  it('checks if the app title is in the document', () => {
    const { getByText } = render(
      <MockedProvider>
        <Homepage />
      </MockedProvider>
    )
    const appTitle = 'Welcome!'
    const registration = 'Registration'
    expect(getByText(appTitle)).toBeInTheDocument()
    expect(getByText(registration)).toBeInTheDocument()
  })
})
