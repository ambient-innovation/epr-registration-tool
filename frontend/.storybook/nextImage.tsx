import * as NextImage from 'next/image'

// Use unoptimized images inside Storybook
// Solution from:
// https://github.com/vercel/next.js/issues/18393#issuecomment-783269086

const OriginalNextImage = NextImage.default
Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
})
