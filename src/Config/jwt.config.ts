import env from 'env-var'

export default Object.freeze({
  engine: env
    .get('JWT_ENGINE')
    .default('jsonwebtoken')
    .asString(),
  expiresIn: env
    .get('JWT_EXPIRES_IN')
    .required()
    .asString(),
  secret: env
    .get('JWT_SECRET')
    .required()
    .asString()
})
