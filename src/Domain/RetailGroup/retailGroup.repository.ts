import { EntityRepository, Repository as _Repository } from 'typeorm'

import { $errors, getTypeORMCustomRepo, QueryUtil } from '@/Shared/Utils'
import { AppError } from '@/Shared/Protocols'

import { Repository as RetailRepo } from '@/Domain/Retail/retail.repository'

import { RetailGroup } from './retailGroup.entity'

export type RetailGroupPayload = Omit<
  RetailGroup,
  'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
>

interface RetailGroupRepo extends _Repository<RetailGroup> {}

@EntityRepository(RetailGroup)
class TypeORMRepo extends _Repository<RetailGroup> implements RetailGroupRepo {}

export class Repository {
  private $getRepo: () => RetailGroupRepo
  private $retail: RetailRepo
  private $query: QueryUtil

  constructor({
    repo = getTypeORMCustomRepo<RetailGroupRepo>(TypeORMRepo),
    $RetailRepo = RetailRepo,
    $Query = QueryUtil
  } = {}) {
    this.$getRepo = repo
    this.$query = new $Query(['name'])
    this.$retail = new $RetailRepo()
  }

  public async find({ limit, page }, query = {}) {
    const where = this.$query.handle(query)
    const [items, totalItems] = await this.$getRepo().findAndCount({
      relations: ['retails'],
      where,
      skip: page,
      take: limit
    })

    const totalPages =
      totalItems <= limit ? 1 : parseInt((Number(totalItems) / limit).toFixed())

    const found = {
      items,
      pagination: {
        totalPages,
        totalItems: Number(totalItems),
        page,
        limit
      }
    }

    if (!found.items.length) throw new AppError($errors.notFound, { query })
    return found
  }

  public async findOne({ limit, page }, query) {
    const group = await this.$getRepo().findOne(
      { ...query },
      { withDeleted: false }
    )

    const retails = await this.$retail.findAlreadyRelatedWithGroup(
      { limit, page },
      { groupId: query.id }
    )

    const found = {
      ...group,
      retails: retails.items,
      retailsPagination: retails.pagination
    }

    if (!found) throw new AppError({ ...$errors.notFound, details: { query } })
    return found
  }

  public async insertOne(payload: RetailGroupPayload) {
    const repo = this.$getRepo()
    const created = await repo.save(repo.create(payload))
    return created
  }

  public async updateOne(payload) {
    const repo = this.$getRepo()

    const { id } = payload
    const found = await repo.findOne({ where: { id, deletedAt: null } })
    if (!found) throw new AppError($errors.notFound, { query: { id }, payload })

    const updated = await repo.save(payload)
    return updated
  }

  public async linkWithRetails({
    id,
    retailIds
  }: {
    id: string
    retailIds: string[]
  }) {
    const repo = this.$getRepo()

    let found = await repo.findOne({
      relations: ['retails'],
      where: { id, deletedAt: null }
    })
    if (!found) throw new AppError($errors.notFound, { query: { id } })

    const retails: any = await Promise.all(
      retailIds.map((id) => {
        return this.$retail.findOne({ id }, { withDeleted: false })
      })
    )
    const retailsSet = new Set([...found.retails, ...retails])
    const _retails = Array.from(retailsSet)

    found = { ...found, retails: _retails }

    const updated = await repo.save(found)
    return updated
  }

  public async unlinkWithRetails({
    id,
    retailIds
  }: {
    id: string
    retailIds: string[]
  }) {
    const repo = this.$getRepo()
    const found = await repo.findOne({
      where: { id, deletedAt: null },
      relations: ['retails']
    })
    if (!found) throw new AppError($errors.notFound, { query: { id } })
    await Promise.all(
      retailIds.map((id) => {
        found.retails = found.retails.filter((retail) => {
          return retail.id !== id
        })
      })
    )
    const updated = await repo.save(found)
    return updated
  }

  public async removeOne({ id }) {
    return await this.$getRepo().softDelete({ id })
  }
}
