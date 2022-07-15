import { promisify } from 'util'
import { resolve } from 'path'
import { stat, mkdir } from 'fs'

import env from 'env-var'

const asyncStat = promisify(stat)
const asyncMkdir = promisify(mkdir)

const accessKeyId = env.get('AWS_S3_ACCESS_KEY_ID').asString()
const secretAccessKey = env.get('AWS_S3_SECRET_ACCESS_KEY').asString()

const config = {
  provider: env.get('FILE_STORAGE_PROVIDER').default('disk').asString(),
  folderName: env
    .get('FILE_STORAGE_LOCAL_FOLDERNAME')
    .default('static')
    .asString(),
  s3: {
    region: env.get('AWS_S3_REGION').default('us-east-1').asString(),
    bucketName: env
      .get('FILE_STORAGE_S3_BUCKET_NAME')
      .default('b2b-resources')
      .asString()
  }
}

if (accessKeyId && secretAccessKey) {
  const s3 = { ...config.s3, credentials: { accessKeyId, secretAccessKey } }
  Object.assign(config, { s3 })
}

;(async () => {
  const folderPath = resolve(__dirname, '..', '..', config.folderName)
  try {
    const folderStat = await asyncStat(folderPath)
    if (!folderStat.isDirectory()) await asyncMkdir(folderPath)
  } catch (_) {
    await asyncMkdir(folderPath)
  }
})()

export default Object.freeze(config)
