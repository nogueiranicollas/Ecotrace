import env from 'env-var'

const config = {
  url: env
    .get('UI_BASE_URL')
    .default('https://b2b.ecotrace.solutions')
    .asUrlString(),
  paths: {
    pwdRecovery: env
      .get('UI_PWD_RECOVERY_PATH')
      .default('esqueci-minha-senha?token')
      .asString()
  }
}

export default Object.freeze(config)
