import { EntityRepository, Repository as _Repository } from 'typeorm'

import { $errors, getTypeORMCustomRepo } from '@/Shared/Utils'
import { AppError } from '@/Shared/Protocols'

import { File } from './file.entity'

export type FilePayload = Omit<
  File,
  'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
>

interface FileRepo extends _Repository<File> {}

@EntityRepository(File)
class TypeORMRepo extends _Repository<File> implements FileRepo {}

export class Repository {
  private $getRepo: () => FileRepo

  constructor({ repo = getTypeORMCustomRepo<FileRepo>(TypeORMRepo) } = {}) {
    this.$getRepo = repo
  }

  public async findOne(query) {
    const found = await this.$getRepo().findOne({ where: query })
    if (!found) {
      throw new AppError({
        ...$errors.notFound,
        details: { entity: 'file', query }
      })
    }

    return found
  }

  public async insertOne(payload: FilePayload) {
    const repo = this.$getRepo()

    const { identifiers } = await repo
      .createQueryBuilder()
      .insert()
      .into(File)
      .values(payload)
      .onConflict('("key") DO NOTHING')
      .execute()
    if (!identifiers.length) throw new AppError($errors.duplicated, { payload })

    const [{ id }] = identifiers
    const created = await repo.findOne({ id })
    return created as File
  }

  public async updateOne(payload: FilePayload & { id: string }) {
    const repo = this.$getRepo()

    const { id } = payload
    const found = await this.findOne({ id })
    const updated = await repo.save({ ...found, ...payload, id })
    return updated
  }

  public async removeOne(id: string) {
    const repo = this.$getRepo()

    const deleted = await repo.delete({ id })
    return deleted
  }
}
