---
to: src/Domain/<%= Name %>/<%= name %>.repository.ts
unless_exists: true
---
import { EntityRepository, Repository as _Repository } from 'typeorm'

import { $errors, getTypeORMCustomRepo } from '@/Shared/Utils'

import { <%= Name %> } from './<%= name %>.entity'
import { AppError } from '@/Shared/Protocols'

type <%= Name %>Payload = Omit<<%= Name %>, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>

interface <%= Name %>Repo extends _Repository<<%= Name %>> {}

@EntityRepository(<%= Name %>)
class TypeORMRepo extends _Repository<<%= Name %>> implements <%= Name %>Repo {}

export class Repository {
  private $getRepo: () => <%= Name %>Repo

  constructor({ repo = getTypeORMCustomRepo<<%= Name %>Repo>(TypeORMRepo) } = {}) {
    this.$getRepo = repo
  }

  public async find(query = {}) {
    const found = await this.$getRepo().find({ where: query })
    if (!found) throw new AppError({ ...$errors.notFound, details: { query } })
    return found
  }

  public async findOne(query) {
    const found = await this.$getRepo().findOne({ where: query })
    if (!found) throw new AppError({ ...$errors.notFound, details: { query } })
    return found
  }

  public async insertOne(payload: <%= Name %>Payload) {
    const repo = this.$getRepo()

    // Use that to check
    // const found = await repo.findOne({ deletedAt: null })
    // if (found) throw new AppError({ ...$errors.duplicated, details: payload })
    const created = repo.create(payload)
    await repo.save(created)

    return created
  }

  public async updateOne(payload) {
    const repo = this.$getRepo()

    const { id } = payload
    const found = await repo.findOne({ id, deletedAt: null })
    if (!found) {
      throw new AppError({
        ...$errors.notFound,
        details: { query: { id }, payload }
      })
    }

    const updated = await repo.save(payload)
    return updated
  }

  public async removeOne({ id }) {
    return await this.updateOne({ id, deletedAt: new Date() })
  }
}
