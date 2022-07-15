import { FileAdapter } from '@/Shared/Adapters'

import { File } from './file.entity'
import { Repository, FilePayload } from './file.repository'

export class Service {
  private $repo: Repository

  private $file: typeof FileAdapter

  constructor({ $Repository = Repository, $File = FileAdapter } = {}) {
    this.$repo = new $Repository()
    this.$file = $File
  }

  public async insertOne(payload: FilePayload): Promise<File> {
    const created = await this.$repo.insertOne(payload)
    return created
  }

  public async replaceOne(payload: FilePayload, old: File): Promise<File> {
    await this.$file.removeOne(old)
    const updated = await this.$repo.updateOne({ ...payload, id: old.id })
    return updated
  }

  public async removeOne({ id }: { id: string }) {
    const deleted = await this.$repo.removeOne(id)
    return deleted
  }
}
