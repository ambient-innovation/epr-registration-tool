import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchPagePreview } from '@/cms/api'
import { CmsPreviewData } from '@/cms/types'
import { getPageType } from '@/cms/utils'
import config from '@/config/config'
import { ROUTES } from '@/routes'

const { PREVIEW_SECRET } = config

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { content_type: contentType, token, secret } = req.query

  if (!PREVIEW_SECRET) {
    return res.status(500).json({ message: 'Preview secret not configured' })
  }
  if (typeof contentType !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid content_type' })
  }
  if (typeof token !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid token' })
  }
  // This secret should only be known to this API route and the CMS
  if (secret !== PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' })
  }

  const pageType = getPageType(contentType)

  if (!pageType) {
    return res
      .status(400)
      .json({ message: `"${contentType}" is not a valid content type` })
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  const page = await fetchPagePreview(pageType, token)

  // If the page doesn't exist prevent preview mode from being enabled
  if (!page) {
    return res.status(404).json({ message: 'Page does not exist' })
  }

  const previewData: CmsPreviewData = {
    token,
    contentType,
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData(previewData, {
    maxAge: 60 * 60, // The preview mode cookies expire in 1 hour
  })

  let redirectUrl = ''
  switch (pageType) {
    case 'cms.StandardPage':
      // we redirect to a dummy slug, because the actual preview page is stored in the token
      redirectUrl = `/${page.meta.locale}${ROUTES.cmsPage('preview')}`
      break
    case 'cms.HomePage':
      redirectUrl = `/${page.meta.locale}${ROUTES.home}`
      break
  }

  res.redirect(redirectUrl)
}
