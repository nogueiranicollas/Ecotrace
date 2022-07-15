import { EntityRepository, Repository as _Repository } from 'typeorm'

import { getTypeORMCustomRepo } from '@/Shared/Utils'

import { CompanyCertifications } from './companyCertifications.entity'

type CompanyCertificationsPayload = Omit<CompanyCertifications, 'id'> & {
  id?: string
}

interface CompanyCertificationsRepo
  extends _Repository<CompanyCertifications> {}

@EntityRepository(CompanyCertifications)
class TypeORMRepo
  extends _Repository<CompanyCertifications>
  implements CompanyCertificationsRepo {}

export class Repository {
  private $getRepo: () => CompanyCertificationsRepo

  constructor({
    repo = getTypeORMCustomRepo<CompanyCertificationsRepo>(TypeORMRepo)
  } = {}) {
    this.$getRepo = repo
  }

  public async insertOne(payload: CompanyCertificationsPayload) {
    const repo = this.$getRepo()
    const created = await repo.save(repo.create(payload))
    return created
  }

  public insertMany(payload: CompanyCertificationsPayload[]) {
    return Promise.all(payload.map(this.insertOne.bind(this)))
  }

  public async updateOne(certification: CompanyCertificationsPayload) {
    const repo = this.$getRepo()
    const updated = await repo.save(certification)
    return updated
  }

  public upsertOne(certification: CompanyCertificationsPayload) {
    if (Object.keys(certification).includes('id'))
      return this.updateOne(certification)
    return this.insertOne(certification)
  }

  public upsertMany(certifications: CompanyCertificationsPayload[]) {
    return Promise.all(certifications.map(this.upsertOne.bind(this)))
  }
}
