// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`
// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/'
import { TextDecoder, TextEncoder } from 'util'

// solves known issue with isomorphic-dompurify
// https://github.com/kkomelin/isomorphic-dompurify#known-issues
// fix from:
// https://github.com/kkomelin/isomorphic-dompurify/issues/91#issuecomment-1012645198
// --> please remove fix and file when not needed anymore

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// mock useRouter
jest.mock('next/dist/client/router', () => ({
  __esModule: true,
  useRouter: () => ({
    query: {},
    pathname: '/',
    asPath: '/',
    locale: 'en',
    events: {
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    },
    push: jest.fn(() => Promise.resolve(true)),
    prefetch: jest.fn(() => Promise.resolve(true)),
    replace: jest.fn(() => Promise.resolve(true)),
  }),
}))
