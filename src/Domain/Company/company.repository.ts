import { omit } from 'lodash'
import {
  EntityRepository,
  FindConditions,
  Not,
  Repository as _Repository
} from 'typeorm'

import { AppError } from '@/Shared/Protocols'
import { $errors, getTypeORMCustomRepo, QueryUtil } from '@/Shared/Utils'

import { Repository as CompanyEmployeeRepo } from '@/Domain/CompanyEmployee/companyEmployee.repository'
import { Repository as CompanyContactsRepo } from '@/Domain/CompanyContacts/companyContacts.repository'
import { Repository as CompanyCertificationsRepo } from '@/Domain/CompanyCertifications/companyCertifications.repository'
import { Repository as CompanyPhotosRepo } from '@/Domain/CompanyPhotos/companyPhotos.repository'
import { Repository as EmployeeRepo } from '@/Domain/Employee/employee.repository'
import { File } from '@/Domain/File/file.entity'

import { Company } from './company.entity'

type CompanyQuery = FindConditions<Company> | FindConditions<Company>[]

export type CompanyPayload = Omit<
  Company,
  'id' | 'employees' | 'createdAt' | 'deletedAt' | 'updatedAt'
> & {
  employees: {
    employee: { bio: string; doc: string; name: string }
    role: string
  }[]
}

interface CompanyRepo extends _Repository<Company> {}

const NON_EXACT_KEYS = ['name', 'fancyName']

@EntityRepository(Company)
class TypeORMRepo extends _Repository<Company> implements CompanyRepo {}

export class Repository {
  private $getRepo: () => CompanyRepo

  private $companyEmployeeRepo: CompanyEmployeeRepo
  private $contactsRepo: CompanyContactsRepo
  private $certificationsRepo: CompanyCertificationsRepo
  private $employeeRepo: EmployeeRepo
  private $photosRepo: CompanyPhotosRepo

  private $query: QueryUtil

  constructor({
    repo = getTypeORMCustomRepo<CompanyRepo>(TypeORMRepo),
    $CompanyEmployeeRepo = CompanyEmployeeRepo,
    $CompanyContactsRepo = CompanyContactsRepo,
    $CompanyCertificationsRepo = CompanyCertificationsRepo,
    $EmployeeRepo = EmployeeRepo,
    $PhotosRepo = CompanyPhotosRepo,
    $Query = QueryUtil
  } = {}) {
    this.$getRepo = repo

    this.$companyEmployeeRepo = new $CompanyEmployeeRepo()
    this.$contactsRepo = new $CompanyContactsRepo()
    this.$certificationsRepo = new $CompanyCertificationsRepo()
    this.$employeeRepo = new $EmployeeRepo()
    this.$photosRepo = new $PhotosRepo()

    this.$query = new $Query(NON_EXACT_KEYS)
  }

  private async mergeWithActiveEmployees(company: Company) {
    const employees = await this.$companyEmployeeRepo.find(
      { companyId: company.id, exitedAt: null },
      { shouldThrow: false }
    )
    return { ...company, employees }
  }

  public async find(
    { limit, page },
    query: any = {},
    { shouldThrow = true } = {}
  ) {
    const where = this.$query.handle(query)
    const { qualifications, group, ...qb } = where

    let command = this.$getRepo()
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.groups', 'groups')
      .where({ ...qb, status: true, deletedAt: null })

    if (group) {
      command = command.andWhere('groups.id = :id', { id: group })
    }

    if (qualifications) {
      command = command.andWhere(
        'qualifications ::text ilike ANY (ARRAY[:item ::text])',
        {
          item: `%${qualifications}%`
        }
      )
    }
    const res = await Promise.all([
      command.getCount(),
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
      items,
      pagination: {
        totalPages,
        totalItems: count,
        page,
        limit
      }
    }

    if (!found.items.length) {
      if (!shouldThrow) return []
      throw new AppError($errors.notFound, {
        entity: 'Company',
        query: where
      })
    }

    const companies = await Promise.all(
      found.items.map(this.mergeWithActiveEmployees.bind(this))
    )

    return { ...found, items: companies }
  }

  public async findByGroup(
    { limit, page },
    { groupId, ...query }: Record<string, any> & { groupId: string }
  ) {
    const where = this.$query.handle(query)

    const res = await Promise.all([
      this.$getRepo()
        .createQueryBuilder('company')
        .innerJoinAndSelect('company.groups', 'groups')
        .where({ ...where, status: true })
        .andWhere('groups.id = :id', { id: groupId })
        .getCount(),
      this.$getRepo()
        .createQueryBuilder('company')
        .innerJoinAndSelect('company.groups', 'groups')
        .select([
          'company.cnpj',
          'company.id',
          'company.name',
          'company.fancyName'
        ])
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

    const companies = {
      items,
      pagination: {
        totalPages,
        totalItems: count,
        page,
        limit
      }
    }

    const found = {
      companies: companies.items,
      companiesPagination: companies.pagination
    }

    if (found) return found
    throw new AppError($errors.notFound, { ...where, groupId })
  }

  public async findUnrelatedWithGroup(
    { limit, page },
    { groupId, ...query }: any & { groupId: string }
  ) {
    const where = this.$query.handle(query)

    const alreadyRelatedCompanies = await this.$getRepo()
      .createQueryBuilder('company')
      .innerJoin('company.groups', 'groups')
      .select('company.id')
      .where('groups.id = :groupId', { groupId })
      .getMany()
    const companiesId = alreadyRelatedCompanies.map(({ id }) => `'${id}'`)

    let found = this.$getRepo()
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.groups', 'groups')
      .select([
        'company.cnpj',
        'company.id',
        'company.name',
        'company.fancyName'
      ])
      .where({ ...where, status: true })

    if (companiesId.length) {
      found = found.andWhere(`company.id NOT IN (${companiesId})`)
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

    const companies = {
      items,
      pagination: {
        totalPages,
        totalItems: count,
        page,
        limit
      }
    }

    if (companies.items.length) return companies
    throw new AppError($errors.notFound, { ...where, groupId })
  }

  public async findOne(query: CompanyQuery, { shouldThrow = true } = {}) {
    const found = await this.$getRepo().findOne({
      relations: ['contacts', 'groups', 'photos', 'certifications'],
      where: { ...query, deletedAt: null }
    })

    if (!found) {
      if (!shouldThrow) return null
      throw new AppError({ ...$errors.notFound, details: { query } })
    }

    const company = await this.mergeWithActiveEmployees(found)
    return company
  }

  public async insertOne(payload: CompanyPayload) {
    const repo = this.$getRepo()

    const { cnpj } = payload
    const found = await repo.findOne({ cnpj }, { withDeleted: false })
    if (found) {
      throw new AppError($errors.duplicated, {
        entity: 'Company',
        id: found.id,
        payload
      })
    }
    const created = await repo
      .createQueryBuilder()
      .insert()
      .into(Company)
      .values(payload)
      .execute()
    const [{ id }] = created.identifiers

    await Promise.all<Promise<any>>([
      this.$contactsRepo.insertMany(
        payload.contacts.map((each) => {
          return { ...each, companyId: id }
        })
      ),
      this.$certificationsRepo.insertMany(
        payload.certifications.map((each) => {
          return { ...each, companyId: id }
        })
      ),
      ...payload.employees.map((employee) =>
        this.$companyEmployeeRepo.insertOne({
          ...employee,
          companyId: id
        })
      )
    ])

    return { ...payload, id } as Company
  }

  public async updateOne(payload: CompanyPayload & { id: string }) {
    const { id } = payload

    const found = (await this.$getRepo().findOne({
      relations: ['contacts', 'certifications', 'employees'],
      where: { id, deletedAt: null }
    })) as Company

    const { cnpj } = payload
    const foundDuplicated = await this.$getRepo().findOne(
      { cnpj, id: Not(id) },
      { withDeleted: false }
    )
    if (foundDuplicated) {
      throw new AppError($errors.duplicated, { cnpj })
    }

    const updated = await this.$getRepo().save({
      ...found,
      ...omit(payload, 'contacts', 'certifications', 'employees'),
      id
    })

    const contacts = payload.contacts.map((e) => ({
      ...e,
      companyId: found.id
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

    const certifications = payload.certifications.map((e) => ({
      ...e,
      companyId: found.id
    }))

    found.certifications.map((certification) => {
      const hasCertification = payload.certifications.find(
        (c) => c.id === certification.id
      )
      if (hasCertification === undefined) {
        certifications.push({
          ...certification
        })
      }
    })

    await this.$contactsRepo.upsertMany(contacts)
    await this.$certificationsRepo.upsertMany(certifications)

    if (payload.employees) {
      await Promise.all(
        payload.employees.map(async (each) => {
          const old = found.employees.find(({ employee }) => {
            return each.employee.doc === employee.doc
          })

          if (!old) {
            const _prev = found.employees.find(({ role }) => role === each.role)
            if (_prev) {
              await this.$companyEmployeeRepo.updateOne({
                id: _prev.id,
                exitedAt: new Date()
              })
            }

            return this.$companyEmployeeRepo.insertOne({
              ...each,
              companyId: payload.id
            })
          }

          return this.$employeeRepo.updateOne({
            ...omit(old.employee, 'photo', 'photoId'),
            ...omit(each.employee, 'photo', 'photoId')
          })
        })
      )
    }

    return updated as Company
  }

  public async updateCompanyPhotos({
    id,
    photos
  }: {
    id: string
    photos: File[]
  }) {
    return await Promise.all(
      photos.map((photo) => {
        return this.$photosRepo.insertOne({
          companyId: id,
          fileId: photo.id
        })
      })
    )
  }

  public async removeOne({ id }: { id: string }) {
    try {
      await this.$getRepo().softDelete({ id })
      return id
    } catch (ex) {
      throw new AppError($errors.notFound, {
        entity: 'Company',
        query: { id }
      })
    }
  }

  public async findAlreadyRelatedWithGroup(
    { limit, page },
    { groupId }: CompanyQuery & { groupId: string }
  ) {
    const [totalItems, items] = await Promise.all([
      this.$getRepo()
        .createQueryBuilder('company')
        .innerJoin('company.groups', 'groups')
        .select('company.id')
        .where('groups.id = :groupId', { groupId })
        .getCount(),
      this.$getRepo()
        .createQueryBuilder('company')
        .innerJoin('company.groups', 'groups')
        .where('groups.id = :groupId', { groupId })
        .skip(page * limit)
        .take(limit)
        .getMany()
    ])

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
}
