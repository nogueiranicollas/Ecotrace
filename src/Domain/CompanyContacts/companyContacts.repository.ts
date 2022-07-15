import { EntityRepository, Repository as _Repository } from 'typeorm'

import { getTypeORMCustomRepo } from '@/Shared/Utils'

import { CompanyContacts } from './companyContacts.entity'

type CompanyContactsPayload = Omit<
  CompanyContacts,
  'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
> & { id?: string }

interface CompanyContactsRepo extends _Repository<CompanyContacts> {}

@EntityRepository(CompanyContacts)
class TypeORMRepo
  extends _Repository<CompanyContacts>
  implements CompanyContactsRepo {}

export class Repository {
  private $getRepo: () => CompanyContactsRepo

  constructor({
    repo = getTypeORMCustomRepo<CompanyContactsRepo>(TypeORMRepo)
  } = {}) {
    this.$getRepo = repo
  }

  public async insertOne(payload: CompanyContactsPayload) {
    const repo = this.$getRepo()
    const created = await repo.save(repo.create(payload))
    return created
  }

  public insertMany(payload: CompanyContactsPayload[]) {
    return Promise.all(payload.map(this.insertOne.bind(this)))
  }

  public async updateOne(contact: CompanyContactsPayload) {
    const repo = this.$getRepo()
    const updated = await repo.save(contact)
    return updated
  }

  public upsertOne(contact: CompanyContactsPayload) {
    if (Object.keys(contact).includes('id')) return this.updateOne(contact)
    return this.insertOne(contact)
  }

  public upsertMany(contacts: CompanyContactsPayload[]) {
    return Promise.all(contacts.map(this.upsertOne.bind(this)))
  }
}
