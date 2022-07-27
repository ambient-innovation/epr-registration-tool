import { NextApiRequest, NextApiResponse } from 'next'

import config from '@/config/config'

const { PUBLISH_SECRET } = config
/**
 * On-demand Revalidation webhook, to manually purge the Next.js cache for a specific page.
 * This makes it easier to update the site cms pages, when
 * the content of the headless CMS is created or updated.
 * **/
export default async function handleWebhook(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'PUT'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  const { slug, secret } = req.body

  if (!PUBLISH_SECRET) {
    return res.status(500).json({ message: 'Publish secret not configured' })
  }
  if (secret !== PUBLISH_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' })
  }

  try {
    console.info('[Next.js] Revalidating /')
    // we need to revalidate homepage, in case menu changes
    await res.revalidate('/')
    if (!!slug) {
      console.info(`[Next.js] Revalidating /${slug}`)
      await res.revalidate(`/${slug}`)
    }

    return res.status(200).json({ revalidated: true })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}
