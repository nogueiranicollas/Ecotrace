import { EntityRepository, Repository as _Repository } from 'typeorm'

import { getTypeORMCustomRepo } from '@/Shared/Utils'

import { RetailContacts } from './retailContacts.entity'

type RetailContactsPayload = Omit<
  RetailContacts,
  'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
>

interface RetailContactsRepo extends _Repository<RetailContacts> {}

@EntityRepository(RetailContacts)
class TypeORMRepo
  extends _Repository<RetailContacts>
  implements RetailContactsRepo {}

export class Repository {
  private $getRepo: () => RetailContactsRepo

  constructor({
    repo = getTypeORMCustomRepo<RetailContactsRepo>(TypeORMRepo)
  } = {}) {
    this.$getRepo = repo
  }

  public async insertOne(payload: RetailContactsPayload) {
    const repo = this.$getRepo()
    const created = await repo.save(repo.create(payload))
    return created
  }

  public insertMany(payload: RetailContactsPayload[]) {
    return Promise.all(payload.map(this.insertOne.bind(this)))
  }

  public async updateOne(contact: RetailContactsPayload) {
    const repo = this.$getRepo()
    const updated = await repo.save(contact)
    return updated
  }

  public upsertOne(contact: RetailContactsPayload) {
    if (Object.keys(contact).includes('id')) return this.updateOne(contact)
    return this.insertOne(contact)
  }

  public upsertMany(contacts: RetailContactsPayload[]) {
    return Promise.all(contacts.map(this.upsertOne.bind(this)))
  }
}
