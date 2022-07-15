import { resolve, join } from 'path'

const { NODE_ENV: env = 'development' } = process.env
const basePath = resolve(__dirname, '..', '..')

const dotEnvPaths: { [key: string]: string } = {
  development: join(basePath, '.env'),
  production: join(basePath, '.env'),
  test: join(basePath, '.env')
}

export default Object.freeze({ env, envPath: dotEnvPaths[env] })
