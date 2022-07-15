import { S3 } from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { join, resolve } from 'path'
import { get } from 'lodash'

import { api as apiConfig, upload as uploadConfig } from '@/Config'

const baseDir = resolve(__dirname, '..', '..', '..')

export class Uploader {
  public engine: multer.Multer

  public static storages = {
    S3: (_) =>
      multerS3({
        acl: 'public-read',
        bucket: uploadConfig.s3.bucketName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key(_req, file, cb) {
          const prefix = Date.now()
          const { originalname: filename } = file

          Object.assign(file, {
            filename,
            src: get(file, 'location'),
            storage: 'S3'
          })

          return cb(null, `${prefix}__${filename}`)
        },
        s3: new S3(uploadConfig.s3)
      }),
    disk: (folderName) =>
      multer.diskStorage({
        destination(_req, file, cb) {
          const destination = join(baseDir, folderName)
          Object.assign(file, { destination })
          return cb(null, destination)
        },
        filename(_req, file, cb) {
          const { originalname, path: key } = file
          const storage = 'disk'
          const filename = `${Date.now()}__${originalname}`
          const src = `${apiConfig.urls.base.replace(
            '127.0.0.1',
            'localhost'
          )}/${folderName}/${filename}`

          Object.assign(file, { filename, key, src, storage })
          return cb(null, filename)
        }
      })
  }

  constructor({
    provider = uploadConfig.provider,
    folderName = uploadConfig.folderName
  } = {}) {
    const engines = { disk: Uploader.storages.disk, S3: Uploader.storages.S3 }
    const Engine = get(engines, provider, engines.disk)

    console.log('Storage Engine ->', provider)

    this.engine = multer({ storage: Engine(folderName) })
  }
}
