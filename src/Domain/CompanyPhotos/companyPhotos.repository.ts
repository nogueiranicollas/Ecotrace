import { EntityRepository, Repository as _Repository } from 'typeorm'

import { getTypeORMCustomRepo } from '@/Shared/Utils'

import { CompanyPhotos } from './companyPhotos.entity'

type CompanyPhotosPayload = Omit<
  CompanyPhotos,
  'company' | 'createdAt' | 'deletedAt' | 'file' | 'id' | 'updatedAt'
>

interface CompanyPhotosRepo extends _Repository<CompanyPhotos> {}

@EntityRepository(CompanyPhotos)
class TypeORMRepo
  extends _Repository<CompanyPhotos>
  implements CompanyPhotosRepo {}

export class Repository {
  private $getRepo: () => CompanyPhotosRepo

  constructor({
    repo = getTypeORMCustomRepo<CompanyPhotosRepo>(TypeORMRepo)
  } = {}) {
    this.$getRepo = repo
  }

  public async insertOne(payload: CompanyPhotosPayload) {
    const repo = this.$getRepo()
    const created = await repo.save(repo.create(payload))
    return created
  }

  public async removeOne({ id }: { id: string }) {
    const repo = this.$getRepo()

    const deleted = await repo.delete({ fileId: id })
    return deleted
  }
}
