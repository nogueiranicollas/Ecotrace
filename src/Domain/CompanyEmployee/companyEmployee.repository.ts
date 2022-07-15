import { omit } from 'lodash'
import { EntityRepository, Repository as _Repository } from 'typeorm'

import { $errors, getTypeORMCustomRepo } from '@/Shared/Utils'
import { AppError } from '@/Shared/Protocols'

import {
  Repository as EmployeeRepo,
  EmployeePayload
} from '@/Domain/Employee/employee.repository'

import { CompanyEmployee } from './companyEmployee.entity'

export type CompanyEmployeePayload = {
  companyId: string
  employee: EmployeePayload
  role: string
}

interface CompanyEmployeeRepo extends _Repository<CompanyEmployee> {}

@EntityRepository(CompanyEmployee)
class TypeORMRepo
  extends _Repository<CompanyEmployee>
  implements CompanyEmployeeRepo {}

export class Repository {
  private $getRepo: () => CompanyEmployeeRepo

  private $employeeRepo: EmployeeRepo

  constructor({
    repo = getTypeORMCustomRepo<CompanyEmployeeRepo>(TypeORMRepo),
    $EmployeeRepo = EmployeeRepo
  } = {}) {
    this.$getRepo = repo
    this.$employeeRepo = new $EmployeeRepo()
  }

  public async find(query = {}, { shouldThrow = true } = {}) {
    const found = await this.$getRepo().find({ where: query })
    if (!found.length) {
      if (!shouldThrow) return []
      throw new AppError({ ...$errors.notFound, details: { query } })
    }
    return found
  }

  public async findOne(query) {
    const found = await this.$getRepo().findOne({ where: query })
    if (!found) throw new AppError({ ...$errors.notFound, details: { query } })
    return found
  }

  public async insertOne(payload: CompanyEmployeePayload) {
    const repo = this.$getRepo()
    const employee = await this.$employeeRepo.insertOne(payload.employee, {
      shouldThrow: false
    })
    const created = await repo.save(
      repo.create({
        ...omit(payload, 'employee'),
        employeeId: employee.id
      })
    )
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
