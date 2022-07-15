import env from 'env-var'

const config = {
  header: env
    .get('AUTH_HEADER')
    .required()
    .asString(),
  prefix: env
    .get('AUTH_PREFIX')
    .required()
    .asString(),
  enabled: env
    .get('AUTH_ENABLED')
    .default('true')
    .asBool()
}

export default Object.freeze(config)
