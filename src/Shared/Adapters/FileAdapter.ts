import { unlink } from 'fs'
import { promisify } from 'util'

import { File } from '@/Domain/File/file.entity'

const asyncUnlink = promisify(unlink)

export class FileAdapter {
  public static async removeOne({ storage, key }: File): Promise<boolean> {
    if (storage === 'disk') await asyncUnlink(key)
    return true
  }
}
