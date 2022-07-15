import env from 'env-var'

export default {
  main: {
    database: env.get('TYPEORM_DATABASE').asString(),
    host: env.get('TYPEORM_HOST').asString(),
    password: env.get('TYPEORM_PASSWORD').asString(),
    port: env.get('TYPEORM_PORT').asIntPositive(),
    type: env.get('TYPEORM_CONNECTION').asString(),
    user: env.get('TYPEORM_USERNAME').asString()
  }
}
