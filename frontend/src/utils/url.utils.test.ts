import { joinUrl } from '@/utils/url.utils'

describe('joinUrl()', () => {
  it('should combine urls with ensuring a single slash as separator', () => {
    expect(joinUrl('foo', 'bar')).toBe('foo/bar')
    expect(joinUrl('foo', 'bar/')).toBe('foo/bar/')
    expect(joinUrl('foo/', 'bar')).toBe('foo/bar')
    expect(joinUrl('foo/', '/bar')).toBe('foo/bar')
    expect(joinUrl('foo/', 'bar/')).toBe('foo/bar/')
    expect(joinUrl('/foo', '//bar')).toBe('/foo/bar')
    expect(joinUrl('/foo/', '/bar/')).toBe('/foo/bar/')
  })
})
