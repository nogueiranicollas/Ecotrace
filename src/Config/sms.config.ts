import env from 'env-var'

const config = {
  tokenLength: env
    .get('VALIDATOR_SMS_TOKEN_LENGTH')
    .default('6')
    .asInt()
}

export default Object.freeze(config)
