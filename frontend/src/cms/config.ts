import config from '@/config/config'
import { joinUrl } from '@/utils/url.utils'

export const CMS_API_URL = joinUrl(config.API_URL, `cms/api/v2`)
