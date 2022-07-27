import { SxStyleObject } from '@/theme/utils'

export const richTextCss: SxStyleObject = {
  h2: {
    marginBottom: { xs: 6, md: 7 },
  },
  h3: {
    marginBottom: { xs: 6, md: 7 },
  },
  h4: {
    marginBottom: { xs: 6, md: 7 },
  },
  ul: {
    paddingLeft: { xs: 9, sm: 12 },
  },
  ol: {
    paddingLeft: { xs: 9, sm: 12 },
  },

  li: {
    paddingLeft: { xs: 2, sm: 4 },
    display: 'list-item',
  },

  a: {
    fontWeight: 'bold',
  },

  'p + p': {
    marginTop: 5,
  },

  // we define margin-top only for successors of previous elements
  // --> basically the same as :not(:first-child)
  // --> avoid warnings about issues with :first-child selector and ssr
  '* ~': {
    h2: {
      marginTop: { xs: 8, md: 10 },
    },

    h3: {
      marginTop: { xs: 8, md: 10 },
    },

    h4: {
      marginTop: { xs: 6, md: 7 },
    },
  },
}

export const centeredSx: SxStyleObject = {
  textAlign: 'center',
  'ol, ul': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}
