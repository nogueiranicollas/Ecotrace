import { EntityRepository, Repository as _Repository } from 'typeorm'
import { omit } from 'lodash'

import { $errors, getTypeORMCustomRepo, QueryUtil } from '@/Shared/Utils'

import { UserPermissions } from './userPermission.entity'
import { AppError } from '@/Shared/Protocols'

interface UserPermissionRepo extends _Repository<UserPermissions> {}

export type UserPermissionPayload = UserPermissions & 'userId'

@EntityRepository(UserPermissions)
class TypeORMRepo
  extends _Repository<UserPermissions>
  implements UserPermissionRepo {}

export class Repository {
  private $getRepo: () => UserPermissionRepo
  private $query: QueryUtil

  constructor({
    repo = getTypeORMCustomRepo<UserPermissionRepo>(TypeORMRepo)
  } = {}) {
    this.$getRepo = repo
  }

  public async find(query = {}) {
    const found = await this.$getRepo().find({ where: query })
    if (!found.length) throw new AppError($errors.notFound, { query })
    return found
  }

  public async findOne(query: string) {
    const where = ' "user_id" = \'' + query + "'"
    const found = await this.$getRepo()
      .createQueryBuilder()
      .where(where)
      .getOne()

    if (found) return found
    throw new AppError($errors.notFound, {
      entity: 'userPermissions',
      query: where
    })
  }

  public async findOneSignIn(query: string) {
    const where = ' "user_id" = \'' + query + "'"
    const found = await this.$getRepo()
      .createQueryBuilder()
      .where(where)
      .getOne()

    if (found) return found
    return new UserPermissions()
  }

  public async insertOne(payload: UserPermissionPayload) {
    const repo = this.$getRepo()
    await repo
      .createQueryBuilder()
      .insert()
      .into(UserPermissions)
      .values(payload)
      .execute()

    return payload
  }

  public async insertOneTeste(payload: UserPermissionPayload) {
    const repo = this.$getRepo()
    await repo
      .createQueryBuilder()
      .insert()
      .into(UserPermissions)
      .values(payload)
      .execute()

    return payload
  }

  public async insertInCreateUser(userId: string, permissions: any) {
    const result = permissions

    const values = {
      userId: userId,
      retail: result.retail,
      provider: result.provider,
      weaving: result.weaving,
      wiring: result.wiring,
      productiveChain: result.productiveChain,
      traceabilityProperty: result.traceabilityProperty,
      blockchainHistory: result.blockchainHistory,
      users: result.users,
      industries: result.industries,
      industriesGroup: result.industriesGroup,
      propertyRegister: result.propertyRegister
    }

    const repo = this.$getRepo()
    await repo
      .createQueryBuilder()
      .insert()
      .into(UserPermissions)
      .values(values)
      .execute()

    return omit(values, 'createdAt', 'updatedAt', 'deletedAt', 'userId')
  }

  public async updateOne(payload: UserPermissionPayload) {
    const repo = this.$getRepo()

    // const { userId } = payload
    // const found = await this.findOne(userId)
    const updated = await repo.save(payload)
    return updated
  }
}
