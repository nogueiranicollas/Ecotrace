import { EntityRepository, Repository as _Repository } from 'typeorm'

import { $errors, getTypeORMCustomRepo } from '@/Shared/Utils'

import { UserCompany } from './userCompany.entity'
import { AppError } from '@/Shared/Protocols'

type UserCompanyPayload = { groupId: string; userId: string }

interface UserCompanyRepo extends _Repository<UserCompany> {}

@EntityRepository(UserCompany)
class TypeORMRepo extends _Repository<UserCompany> implements UserCompanyRepo {}

export class Repository {
  private $getRepo: () => UserCompanyRepo

  constructor({
    repo = getTypeORMCustomRepo<UserCompanyRepo>(TypeORMRepo)
  } = {}) {
    this.$getRepo = repo
  }

  public async insertOne(
    { groupId, userId }: UserCompanyPayload,
    { shouldThrow = true } = {}
  ) {
    const repo = this.$getRepo()

    const found = await repo.findOne({ where: { groupId, userId } })
    if (found) {
      if (shouldThrow) throw new AppError($errors.duplicated)
      return found
    }

    const { id } = await repo.save({ groupId, userId })
    const created = await repo.findOne({ id })
    return created as UserCompany
  }

  public async findGroups() {
    const found = await this.$getRepo()
      .createQueryBuilder('userCompany')
      .select('userCompany.groupId')
      .innerJoinAndSelect('userCompany.group', 'group')
      .distinct(true)
      .getMany()
    if (!found.length) return []

    const options = Array.from(
      new Set(found.map(({ groupId }) => groupId))
    ).map(each => ({
      id: each,
      name: found.find(({ group }) => group.id === each)?.group.name || ''
    }))

    return options
  }

  public async removeOne(
    { groupId, userId }: UserCompanyPayload,
    { shouldThrow = false } = {}
  ) {
    const repo = this.$getRepo()

    const found = await repo.findOne({ where: { groupId, userId } })
    if (!found) {
      if (shouldThrow) throw new AppError($errors.duplicated)
      return found
    }

    return repo.delete({ groupId, userId })
  }
}
