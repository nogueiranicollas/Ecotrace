import { pick } from 'lodash'
import { AppError, ReqFile, WithFileReq } from '@/Shared/Protocols'
import { $errors } from './errors.utils'

export class MulterUtils {
  public static mapFilePayload({ file }: WithFileReq): ReqFile {
    if (!file) throw new AppError($errors.validationFails)

    const base = pick(file, ['key', 'src', 'location'])
    const ext = (() => {
      const parts = file.originalname.split('.')
      return parts[parts.length - 1]
    })()

    return {
      ext,
      filename: file.filename,
      src: base.src || base.location || '',
      mime: file.mimetype,
      storage: file.storage,
      key: file.key || file.path
    }
  }
}
