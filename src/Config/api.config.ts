import env from 'env-var'

import app from './app.config'

const { API_SLUG: apiSlug = 'api', STATUS_SLUG: statusSlug = '/' } = process.env

const host = env.get('HOST').default('http://localhost').asUrlString()

const port = env.get('PORT').default(5000).asPortNumber()

function handleSlug(rawSlug) {
  if (rawSlug.charAt(0) !== '/') return `/${rawSlug}`
  return rawSlug
}

const baseUrl = (() => {
  let _url = host
  if (app.env === 'development') {
    const lastCharIndex = _url.length - 1
    if (_url.charAt(lastCharIndex) === '/') {
      _url = _url.substring(0, lastCharIndex)
    }
    return `${_url}:${port}`
  }
  return _url
})()

const urls = Object.freeze({ base: baseUrl })
const slugs = Object.freeze({
  api: handleSlug(apiSlug),
  status: handleSlug(statusSlug)
})

const blockChainHost = env.get('BLOCKCHAIN_HOST').asUrlString()

export default Object.freeze({ blockChainHost, port, urls, slugs })
