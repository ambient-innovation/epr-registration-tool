import { NextApiRequest, NextApiResponse } from 'next'

import { ROUTES } from '@/routes'

export default async (_: NextApiRequest, res: NextApiResponse) => {
  // clear preview mode cookies
  // https://nextjs.org/docs/advanced-features/preview-mode#clear-the-preview-mode-cookies
  res.clearPreviewData()
  res.redirect(ROUTES.home)
}
