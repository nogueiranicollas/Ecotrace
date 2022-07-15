import env from 'env-var'
import path from 'path'

const folderPath = env
  .get('TEMPLATES_FOLDER_PATH')
  .default('src/Templates')
  .asString()

const config = {
  folder: path.resolve(__dirname, '..', '..', folderPath),
  engine: env.get('TEMPLATES_ENGINE').default('handlebars').asString()
}

export default Object.freeze(config)
