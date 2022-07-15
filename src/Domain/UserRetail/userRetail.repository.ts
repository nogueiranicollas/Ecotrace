import { EntityRepository, Repository as _Repository } from 'typeorm'

import { $errors, getTypeORMCustomRepo } from '@/Shared/Utils'

import { UserRetail } from './userRetail.entity'
import { AppError } from '@/Shared/Protocols'

type UserRetailPayload = { groupId: string; userId: string }

interface UserRetailRepo extends _Repository<UserRetail> {}

@EntityRepository(UserRetail)
class TypeORMRepo extends _Repository<UserRetail> implements UserRetailRepo {}

export class Repository {
  private $getRepo: () => UserRetailRepo

  constructor({
    repo = getTypeORMCustomRepo<UserRetailRepo>(TypeORMRepo)
  } = {}) {
    this.$getRepo = repo
  }

  public async insertOne(
    { groupId, userId }: UserRetailPayload,
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
    return created as UserRetail
  }

  public async findGroups() {
    const found = await this.$getRepo()
      .createQueryBuilder('userRetail')
      .select('userRetail.groupId')
      .innerJoinAndSelect('userRetail.group', 'group')
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
    { groupId, userId }: UserRetailPayload,
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
