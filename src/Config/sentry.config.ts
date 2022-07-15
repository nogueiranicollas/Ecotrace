import env from 'env-var'

export default Object.freeze({
  dsn: env.get('SENTRY_DSN').asUrlString(),
  debug: env
    .get('SENTRY_DEBUG')
    .default('false')
    .asBool(),
  enabled: env
    .get('SENTRY_ENABLED')
    .default('true')
    .asBool()
})
