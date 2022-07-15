import { EntityRepository, Not, Repository as _Repository } from 'typeorm'

import { AppError } from '@/Shared/Protocols'
import { $errors, getTypeORMCustomRepo, QueryUtil } from '@/Shared/Utils'

import { Retail } from './retail.entity'
import { orderBy } from 'lodash'

export type RetailPayload = Omit<
  Retail,
  'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
>

interface RetailRepo extends _Repository<Retail> {}

@EntityRepository(Retail)
class TypeORMRepo extends _Repository<Retail> implements RetailRepo {}

export class Repository {
  private $getRepo: () => RetailRepo
  private $query: QueryUtil

  constructor({
    repo = getTypeORMCustomRepo<RetailRepo>(TypeORMRepo),
    $Query = QueryUtil
  } = {}) {
    this.$getRepo = repo
    this.$query = new $Query(['fancyName', 'name'])
  }

  public async find({ limit, page, column, sort }, query = {}) {
    const where = this.$query.handle(query)
    const { group, ...qb } = where

    let command = this.$getRepo()
      .createQueryBuilder('retail')
      .leftJoinAndSelect('retail.groups', 'groups')
      .where({ ...qb })

    if (group) {
      command = command.andWhere('groups.id = :id', { id: group })
    }

    const columnSort = column === 'total' ? 'groups' : `retail.${column}`
    const countCommand = command

    if (columnSort !== 'groups') {
      command = command.orderBy(columnSort, sort.toUpperCase())
    }

    const res = await Promise.all([
      countCommand.getCount(),
      command
        .skip(page * limit)
        .take(limit)
        .getMany()
    ])

    const [totalItems, items] = res

    const count = Number(totalItems)

    const totalPages =
      totalItems <= limit ? 1 : parseInt((count / limit).toFixed())

    const found = {
      items: columnSort === 'groups' ? orderBy(items, ['groups'], sort) : items,
      pagination: {
        totalPages,
        totalItems: count,
        page,
        limit
      }
    }

    if (!found.items.length) throw new AppError($errors.notFound, { query })
    return found
  }

  public async findOne(
    query,
    { shouldThrow = true, withDeleted = false } = {}
  ) {
    const found = await this.$getRepo().findOne({
      withDeleted,
      relations: ['contacts', 'groups'],
      where: query
    })
    if (!found) {
      if (!shouldThrow) return null
      throw new AppError({ ...$errors.notFound, details: { query } })
    }

    return found
  }

  public async findByGroup(
    { limit, page },
    { groupId, ...query }: Record<string, any> & { groupId: string }
  ) {
    const where = this.$query.handle(query)

    const res = await Promise.all([
      this.$getRepo()
        .createQueryBuilder('retail')
        .innerJoinAndSelect('retail.groups', 'groups')
        .where({ ...where, status: true })
        .andWhere('groups.id = :id', { id: groupId })
        .getCount(),
      this.$getRepo()
        .createQueryBuilder('retail')
        .innerJoinAndSelect('retail.groups', 'groups')
        .select(['retail.cnpj', 'retail.id', 'retail.name', 'retail.fancyName'])
        .where({ ...where, status: true })
        .andWhere('groups.id = :id', { id: groupId })
        .skip(page * limit)
        .take(limit)
        .getMany()
    ])

    const [totalItems, items] = res

    const count = Number(totalItems)

    const totalPages =
      totalItems <= limit ? 1 : parseInt((count / limit).toFixed())

    const retails = {
      items,
      pagination: {
        totalPages,
        totalItems: count,
        page,
        limit
      }
    }

    const found = {
      retails: retails.items,
      retailsPagination: retails.pagination
    }

    if (found) return found
    throw new AppError($errors.notFound, { ...where, groupId })
  }

  public async findUnrelatedWithGroup(
    { limit, page },
    { groupId, ...query }: Record<string, any> & { groupId: string }
  ) {
    const where = this.$query.handle(query)

    const alreadyRelatedRetails = await this.$getRepo()
      .createQueryBuilder('retail')
      .innerJoin('retail.groups', 'groups')
      .select(['retail.id'])
      .where('groups.id = :groupId', { groupId })
      .getMany()
    const retailsId = alreadyRelatedRetails.map(({ id }) => `'${id}'`)

    let found = this.$getRepo()
      .createQueryBuilder('retail')
      .leftJoinAndSelect('retail.groups', 'groups')
      .select(['retail.cnpj', 'retail.id', 'retail.name'])
      .where({ ...where, status: true })

    if (retailsId.length) {
      found = found.andWhere(`retail.id NOT IN (${retailsId})`)
    }

    const res = await Promise.all([
      found.getCount(),
      found
        .skip(page * limit)
        .take(limit)
        .getMany()
    ])

    const [totalItems, items] = res

    const count = Number(totalItems)

    const totalPages =
      totalItems <= limit ? 1 : parseInt((count / limit).toFixed())

    const retails = {
      items,
      pagination: {
        totalPages,
        totalItems: count,
        page,
        limit
      }
    }

    if (retails.items.length) return retails
    throw new AppError($errors.notFound, { ...where, groupId })
  }

  public async insertOne(payload: RetailPayload) {
    const repo = this.$getRepo()

    const { cnpj } = payload
    const found = await this.findOne(
      { cnpj },
      { shouldThrow: false, withDeleted: false }
    )
    if (found) throw new AppError($errors.duplicated, { cnpj })

    const created = await repo.save(repo.create(payload))
    return created
  }

  public async updateOne(payload) {
    const repo = this.$getRepo()

    const { id } = payload
    const found = await repo.findOne({
      relations: ['contacts'],
      where: { id, deletedAt: null }
    })
    if (!found) {
      throw new AppError({
        ...$errors.notFound,
        details: { query: { id }, payload }
      })
    }

    const { cnpj } = payload
    const foundDuplicated = await this.findOne(
      { cnpj, id: Not(id) },
      { shouldThrow: false, withDeleted: false }
    )
    if (foundDuplicated) throw new AppError($errors.duplicated, { cnpj })

    const contacts = payload.contacts.map((e) => ({
      ...e,
      retailId: found.id
    }))

    found.contacts.map((contact) => {
      const hasContact = payload.contacts.find((c) => c.id === contact.id)
      if (hasContact === undefined) {
        contacts.push({
          ...contact,
          deletedAt: new Date()
        })
      }
    })

    const updated = await repo.save({
      ...payload,
      contacts
    })
    return updated
  }

  public async removeOne({ id }) {
    return await this.$getRepo().softDelete({ id })
  }

  public async findAlreadyRelatedWithGroup(
    { limit, page },
    { groupId }: Record<string, any> & { groupId: string }
  ) {
    const res = await Promise.all([
      this.$getRepo()
        .createQueryBuilder('retail')
        .innerJoin('retail.groups', 'groups')
        .select(['retail.id'])
        .where('groups.id = :groupId', { groupId })
        .getCount(),
      this.$getRepo()
        .createQueryBuilder('retail')
        .innerJoin('retail.groups', 'groups')
        .where('groups.id = :groupId', { groupId })
        .skip(page * limit)
        .take(limit)
        .getMany()
    ])

    const [totalItems, items] = res

    const count = Number(totalItems)

    const totalPages =
      totalItems <= limit ? 1 : parseInt((count / limit).toFixed())

    const retails = {
      items,
      pagination: {
        totalPages,
        totalItems: count,
        page,
        limit
      }
    }

    return retails
  }
}
