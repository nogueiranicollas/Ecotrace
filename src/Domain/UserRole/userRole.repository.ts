import { EntityRepository, Repository as _Repository } from 'typeorm'

import { $errors, getTypeORMCustomRepo } from '@/Shared/Utils'

import { UserRole } from './userRole.entity'
import { AppError } from '@/Shared/Protocols'

interface UserRoleRepo extends _Repository<UserRole> {}

@EntityRepository(UserRole)
class TypeORMRepo extends _Repository<UserRole> implements UserRoleRepo {}

export class Repository {
  private $getRepo: () => UserRoleRepo

  constructor({ repo = getTypeORMCustomRepo<UserRoleRepo>(TypeORMRepo) } = {}) {
    this.$getRepo = repo
  }

  public async find(query = {}) {
    const found = await this.$getRepo().find({ where: query })
    if (!found.length) throw new AppError($errors.notFound, { query })
    return found
  }
}
