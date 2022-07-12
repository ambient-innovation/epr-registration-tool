import { render } from '@/utils/test.utils'

import { RichText } from './RichText'

describe('<RichText>', () => {
  it('renders an internal link as a MUI component', async () => {
    const html = `<a href='/foo'><span>Hello world</span></a>`
    const { container } = render(<RichText html={html} />)
    const internalLink = container.querySelector('a')
    expect(internalLink).not.toBeNull()
    expect(internalLink).toHaveAttribute('href', '/foo')
    expect(internalLink).toHaveClass('MuiLink-root')
  })
  it('renders a h2 heading as MUI component', async () => {
    const html = `<h2>Hello World</h2>`
    const { container } = render(<RichText html={html} />)
    const internalLink = container.querySelector('h2')
    expect(internalLink).not.toBeNull()
    expect(internalLink).toHaveClass('MuiTypography-root', 'MuiTypography-h2')
  })
})
