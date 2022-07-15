import { EntityRepository, Repository as _Repository } from 'typeorm'

import { getTypeORMCustomRepo } from '@/Shared/Utils'

import { PropertyCertifications } from './propertyCertifications.entity'

type PropertyCertificationsPayload = Omit<PropertyCertifications, 'id'> & {
  id?: string
}

interface PropertyCertificationsRepo
  extends _Repository<PropertyCertifications> {}

@EntityRepository(PropertyCertifications)
class TypeORMRepo
  extends _Repository<PropertyCertifications>
  implements PropertyCertificationsRepo {}

export class Repository {
  private $getRepo: () => PropertyCertificationsRepo

  constructor({
    repo = getTypeORMCustomRepo<PropertyCertificationsRepo>(TypeORMRepo)
  } = {}) {
    this.$getRepo = repo
  }

  public async insertOne(payload: PropertyCertificationsPayload) {
    const repo = this.$getRepo()
    const created = await repo.save(repo.create(payload))
    return created
  }

  public insertMany(payload: PropertyCertificationsPayload[]) {
    return Promise.all(payload.map(this.insertOne.bind(this)))
  }

  public async updateOne(certification: PropertyCertificationsPayload) {
    const repo = this.$getRepo()
    const updated = await repo.save(certification)
    return updated
  }

  public upsertOne(certification: PropertyCertificationsPayload) {
    if (Object.keys(certification).includes('id'))
      return this.updateOne(certification)
    return this.insertOne(certification)
  }

  public upsertMany(certifications: PropertyCertificationsPayload[]) {
    return Promise.all(certifications.map(this.upsertOne.bind(this)))
  }

  public async upsert(
    payload,
    user,
    propertyId,
    add = false
  ): Promise<PropertyCertifications[]> {
    const propertyCertificationsPromise = payload.certifications
      .filter((e) => e)
      .map((certification) => {
        return this.upsertOne({ ...certification, propertyId: propertyId })
      })
    return await Promise.all(propertyCertificationsPromise)
  }
}

export function getRepo(): Repository {
  return new Repository()
}
