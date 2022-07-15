import { EntityRepository, Repository as _Repository } from 'typeorm'
import { omit } from 'lodash'

import { $errors, getTypeORMCustomRepo } from '@/Shared/Utils'

import { Employee } from './employee.entity'
import { AppError } from '@/Shared/Protocols'

export type EmployeePayload = Pick<Employee, 'bio' | 'doc' | 'name'>

interface EmployeeRepo extends _Repository<Employee> {}

@EntityRepository(Employee)
class TypeORMRepo extends _Repository<Employee> implements EmployeeRepo {}

export class Repository {
  private $getRepo: () => EmployeeRepo

  constructor({ repo = getTypeORMCustomRepo<EmployeeRepo>(TypeORMRepo) } = {}) {
    this.$getRepo = repo
  }

  public async find(query = {}) {
    const found = await this.$getRepo().find({ where: query })
    if (!found.length) throw new AppError($errors.notFound, { query })
    return found
  }

  public async findOne(query, { shouldThrow = true } = {}) {
    const found = await this.$getRepo().findOne({ where: query })
    if (!found) {
      if (!shouldThrow) return null
      throw new AppError({ ...$errors.notFound, details: { query } })
    }

    return found
  }

  public async insertOne(
    payload: EmployeePayload,
    { shouldThrow = true } = {}
  ) {
    const repo = this.$getRepo()

    const { doc } = payload
    const found = await this.findOne({ doc }, { shouldThrow })
    if (found) {
      if (shouldThrow) throw new AppError($errors.duplicated, { doc })
      return found
    }

    const created = repo.create(payload)
    await repo.save(created)
    return created
  }

  public async updateOne(payload: EmployeePayload & { id: string }) {
    const { id } = payload
    const found = await this.findOne({ id })
    return this.$getRepo().save({
      ...omit(found, 'photo', 'photoId'),
      ...payload,
      id
    })
  }

  public async setProfilePhoto({
    id,
    photoId
  }: {
    id: string
    photoId: string
  }) {
    const found = await this.findOne({ id })
    return this.$getRepo().save({
      ...omit(found, 'photo', 'photoId'),
      photoId,
      id
    })
  }
}
