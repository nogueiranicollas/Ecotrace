import { fromPairs, omit } from 'lodash'
import {
  EntityRepository,
  FindConditions,
  ILike,
  Not,
  Repository as _Repository
} from 'typeorm'

import { AppError } from '@/Shared/Protocols'
import { $errors, getTypeORMCustomRepo } from '@/Shared/Utils'

import { Repository as CompanyRepo } from '@/Domain/Company/company.repository'
import { Repository as CompanyGroupProfileRepo } from '@/Domain/CompanyGroupProfile/companyGroupProfile.repository'

import { CompanyGroup } from './companyGroup.entity'

export type CompanyGroupPayload = Omit<
  CompanyGroup,
  'id' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'companyGroupRole'
>
type CompanyGroupQuery =
  | FindConditions<CompanyGroup>
  | FindConditions<CompanyGroup>[]

interface CompanyGroupRepo extends _Repository<CompanyGroup> {}

@EntityRepository(CompanyGroup)
class TypeORMRepo
  extends _Repository<CompanyGroup>
  implements CompanyGroupRepo {}

export class Repository {
  private $getRepo: () => CompanyGroupRepo
  private $companyRepo: CompanyRepo
  private $companyGroupProfileRepo: CompanyGroupProfileRepo

  constructor({
    repo = getTypeORMCustomRepo<CompanyGroupRepo>(TypeORMRepo),
    $CompanyRepo = CompanyRepo,
    $CompanyGroupProfileRepo = CompanyGroupProfileRepo
  } = {}) {
    this.$getRepo = repo
    this.$companyRepo = new $CompanyRepo()
    this.$companyGroupProfileRepo = new $CompanyGroupProfileRepo()
  }

  private removeEmpty(query = {}) {
    const pairs: [string, any][] = Object.keys(query)
      .filter((e) => query[e])
      .map((key) => [String(key), ILike(`%${query[key]}%`)])
    return fromPairs(pairs)
  }

  public async find({ limit, page }, query: CompanyGroupQuery = {}) {
    const [items, totalItems] = await this.$getRepo().findAndCount({
      relations: ['companies', 'companyGroupProfiles', 'companyGroupRole'],
      where: { ...this.removeEmpty(query), deletedAt: null },
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

    if (!found.items.length) {
      throw new AppError($errors.notFound, { entity: 'CompanyGroup', query })
    }

    return found
  }

  public async findAccessReleaseOnly(
    { limit, page },
    query: CompanyGroupQuery = {}
  ) {
    const [items, totalItems] = await this.$getRepo().findAndCount({
      relations: ['companyGroupRole'],
      where: {
        ...this.removeEmpty(query),
        deletedAt: null
      },
      skip: page,
      take: limit
    })

    const totalPages =
      totalItems <= limit ? 1 : parseInt((Number(totalItems) / limit).toFixed())

    items.forEach((item) => {
      item.companies = []
    })

    const found = {
      items,
      pagination: {
        totalPages,
        totalItems: Number(totalItems),
        page,
        limit
      }
    }

    if (!found.items.length) {
      throw new AppError($errors.notFound, { entity: 'CompanyGroup', query })
    }

    return found
  }

  public async findOne({ limit, page }, query) {
    const group = await this.$getRepo().findOne(
      { ...query, relations: ['companyGroupProfiles', 'companyGroupRole'] },
      { withDeleted: false }
    )

    const companies = await this.$companyRepo.findAlreadyRelatedWithGroup(
      { limit, page },
      { groupId: query.id }
    )

    const found = {
      ...group,
      companies: companies.items,
      companiesPagination: companies.pagination
    }

    if (!found) throw new AppError({ ...$errors.notFound, details: { query } })
    return found
  }

  public async findAlreadyRelatedWithGroupProfile(
    { limit, page },
    { groupId }: CompanyGroupQuery & { groupId: string }
  ) {
    const res = await Promise.all([
      this.$getRepo().createQueryBuilder('company_group').getCount(),
      this.$getRepo()
        .createQueryBuilder('company_group')
        .innerJoin(
          'company_group.company_group_profiles',
          'companyGroupsProfiles'
        )
        .where('companyGroupsProfiles.company_group_id = :groupId', { groupId })
        .skip(page * limit)
        .take(limit)
        .getMany()
    ])

    const [totalItems, items] = res

    const count = Number(totalItems)

    const totalPages =
      totalItems <= limit ? 1 : parseInt((count / limit).toFixed())

    const companies = {
      items,
      pagination: {
        totalPages,
        totalItems: count,
        page,
        limit
      }
    }

    return companies
  }

  public async insertOne(payload: CompanyGroupPayload) {
    const repo = this.$getRepo()

    const { cnpj } = payload
    const found = await repo.findOne({ cnpj, deletedAt: null })
    if (found) throw new AppError($errors.duplicated, { cnpj })

    const { identifiers } = await repo
      .createQueryBuilder()
      .insert()
      .into(CompanyGroup)
      .values(payload)
      .execute()

    const [affected] = identifiers

    if (payload.companies && payload.companies.length) {
      await Promise.all(
        payload.companies.map((company) => {
          return this.$companyRepo.insertOne({
            ...omit(company, 'employees'),
            employees: []
          })
        })
      )
    }

    const entity = await repo.findOne({ id: affected.id })

    const entity2 = {
      ...entity,
      companyGroupProfiles: payload.companyGroupProfiles
    }

    await repo.save(entity2)

    const created = await repo.findOne({
      where: { ...affected, deletedAt: null },
      relations: ['companies', 'companyGroupProfiles']
    })

    return created as CompanyGroup
  }

  public async linkWithCompanies({
    id,
    companyIds
  }: {
    id: string
    companyIds: string[]
  }) {
    const repo = this.$getRepo()

    let found = await repo.findOne({
      relations: ['companies'],
      where: { id, deletedAt: null }
    })
    if (!found) throw new AppError($errors.notFound, { query: { id } })

    const companies: any = await Promise.all(
      companyIds.map((id) => {
        return this.$companyRepo.findOne({ id, deletedAt: null })
      })
    )
    const companiesSet = new Set([...found.companies, ...companies])
    const _companies = Array.from(companiesSet)

    found = { ...found, companies: _companies }

    const updated = await repo.save(found)
    return updated
  }

  public async unlinkWithCompanies({
    id,
    companyIds
  }: {
    id: string
    companyIds: string[]
  }) {
    const repo = this.$getRepo()
    const found = await repo.findOne({
      where: { id, deletedAt: null },
      relations: ['companies']
    })
    if (!found) throw new AppError($errors.notFound, { query: { id } })
    await Promise.all(
      companyIds.map((id) => {
        found.companies = found.companies.filter((company) => {
          return company.id !== id
        })
      })
    )
    const updated = await repo.save(found)
    return updated
  }

  public async updateOne(payload) {
    const repo = this.$getRepo()

    const { id, cnpj } = payload
    const found = await repo.findOne({
      relations: ['companies'],
      where: { id, deletedAt: null }
    })
    if (!found) {
      throw new AppError($errors.notFound, {
        entity: 'CompanyGroup',
        query: { id },
        payload
      })
    }

    const foundDuplicateCnpj = await repo.findOne({
      cnpj,
      id: Not(id),
      deletedAt: null
    })
    if (foundDuplicateCnpj) throw new AppError($errors.duplicated, { cnpj })

    const updated = await repo.save({
      ...omit(found, 'companies'),
      ...omit(payload, 'companies')
    })
    return updated as CompanyGroup
  }

  public async removeOne({ id }) {
    return await this.$getRepo().softDelete({ id })
  }
}
