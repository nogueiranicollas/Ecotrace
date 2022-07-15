import env from 'env-var'

const config = {
  RENNER: {
    database: env.get('RENNER_DW_NAME').required().asString(),
    host: env.get('RENNER_DW_HOST').required().asString(),
    password: env.get('RENNER_DW_PASS').required().asString(),
    port: env.get('RENNER_DW_PORT').required().asPortNumber(),
    user: env.get('RENNER_DW_USER').required().asString()
  }
}

export default Object.freeze(config)
