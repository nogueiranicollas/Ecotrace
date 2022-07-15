import env from 'env-var'
import { Credentials } from 'aws-sdk'

const _env = env.get('NODE_ENV').default('development').asString()

const name = env
  .get('EMAIL_FROM_NAME')
  .default('[Ecotrace] Portal B2B')
  .asString()
const email = env
  .get('EMAIL_FROM_ADDRESS')
  .default('no-reply@ecotrace.info')
  .asString()

const config = {
  from: `${name} <${email}>`,
  engine: env.get('EMAIL_ENGINE').default('SES').asString(),
  region: env.get('EMAIL_SES_REGION').default('us-east-1').asString(),
  enabled: env.get('EMAIL_ENGINE_ENABLED').default('true').asBool()
}

if (_env === 'development' || _env === 'test') {
  const accessKeyId = env
    .get('EMAIL_ENGINE_ACCESS_KEY_ID')
    .required()
    .asString()
  const secretAccessKey = env
    .get('EMAIL_ENGINE_SECRET_ACCESS_KEY')
    .required()
    .asString()
  const credentials = new Credentials({ accessKeyId, secretAccessKey })
  Object.assign(config, { credentials })
}

export default Object.freeze(config)
