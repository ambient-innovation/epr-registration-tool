export default {
  // `|| ''` --> make type is `string` instead of `string | undefined`
  API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || '',
}
