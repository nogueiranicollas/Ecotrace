import env from 'env-var'

const config = {
  templateName: env
    .get('PWD_RECOVERY_TEMPLATE_NAME')
    .default('password-recovery')
    .asString(),
  emailSubject: env
    .get('PWD_RECOVERY_EMAIL_SUBJECT')
    .default('Recuperação de Senha')
    .asString(),
  tokenLength: env.get('PWD_RECOVERY_TOKEN_LENGTH').default(24).asInt()
}

export default Object.freeze(config)
