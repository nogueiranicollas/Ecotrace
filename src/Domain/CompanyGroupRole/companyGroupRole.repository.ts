import { EntityRepository, Repository as _Repository } from 'typeorm'

import { $errors, getTypeORMCustomRepo } from '@/Shared/Utils'

import { CompanyGroupRole } from './companyGroupRole.entity'
import { AppError } from '@/Shared/Protocols'

interface CompanyGroupRoleRepo extends _Repository<CompanyGroupRole> {}

@EntityRepository(CompanyGroupRole)
class TypeORMRepo
  extends _Repository<CompanyGroupRole>
  implements CompanyGroupRoleRepo {}

export class Repository {
  private $getRepo: () => CompanyGroupRoleRepo

  constructor({
    repo = getTypeORMCustomRepo<CompanyGroupRoleRepo>(TypeORMRepo)
  } = {}) {
    this.$getRepo = repo
  }

  public async find(query = {}) {
    const found = await this.$getRepo().find({ where: query })
    if (!found.length) throw new AppError($errors.notFound, { query })
    return found
  }
}
