import { render, cleanup } from '@/utils/test.utils'

import { Homepage } from './Homepage'

describe('Homepage', () => {
  afterEach(cleanup)
  it('checks if the app title is in the document', () => {
    const { getByText } = render(<Homepage />)
    const appTitle = 'EPR Registration Tool'
    expect(getByText(appTitle)).toBeInTheDocument()
  })
})
