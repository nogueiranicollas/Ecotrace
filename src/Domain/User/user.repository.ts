import { omit, orderBy, pick } from 'lodash'
import {
  EntityRepository,
  FindConditions,
  Not,
  Repository as _Repository,
  SelectQueryBuilder
} from 'typeorm'

import { Cypher } from '@/Shared/Providers'
import { $errors, getTypeORMCustomRepo, QueryUtil } from '@/Shared/Utils'
import { AppError } from '@/Shared/Protocols'

import { Repository as UserCompanyRepo } from '@/Domain/UserCompany/userCompany.repository'
import { Repository as UserRetailRepo } from '@/Domain/UserRetail/userRetail.repository'
import { Repository as UserPermissionRepo } from '@/Domain/UserPermission/userPermission.repository'

import { User } from './user.entity'
import { UserCompany } from '../UserCompany/userCompany.entity'
import { UserRetail } from '../UserRetail/userRetail.entity'
import { UserPermissions } from '../UserPermission/userPermission.entity'

type UserQuery = FindConditions<User> | FindConditions<User>[]
export type UserPermissionPayload = UserPermissions

export type UserPayload = Omit<
  User,
  | 'id'
  | 'companies'
  | 'retails'
  | 'permissions'
  | 'createdAt'
  | 'deletedAt'
  | 'updatedAt'
> & {
  password: string
  companies: string[]
  retails: string[]
  permissions: UserPermissionPayload & 'userId'
  companiesGroups: { id: string }[]
}

export type UserPassword = {
  id: string
  currentPassword: string
  password: string
}

interface UserRepo extends _Repository<User> {}

@EntityRepository(User)
class TypeORMRepo extends _Repository<User> implements UserRepo {}

export class Repository {
  private $getRepo: () => UserRepo
  private $userCompany: UserCompanyRepo
  private $userRetail: UserRetailRepo
  private $userPermission: UserPermissionRepo
  private $cypher: Cypher
  private $query: QueryUtil

  constructor({
    repo = getTypeORMCustomRepo<UserRepo>(TypeORMRepo),
    $UserCompanyRepo = UserCompanyRepo,
    $UserRetailRepo = UserRetailRepo,
    $Cypher = Cypher,
    $Query = QueryUtil
  } = {}) {
    this.$getRepo = repo
    this.$userCompany = new $UserCompanyRepo()
    this.$userRetail = new $UserRetailRepo()
    this.$cypher = new $Cypher()
    this.$userPermission = new UserPermissionRepo()
    this.$query = new $Query(['department', 'name'])
  }

  private setByRetailQuery(
    query: SelectQueryBuilder<User>,
    params: Record<string, any>
  ) {
    if (params.retail) {
      return query.andWhere('retail.groupId = :retail', {
        retail: params.retail
      })
    }
    return query
  }

  private setByCompanyQuery(
    query: SelectQueryBuilder<User>,
    params: Record<string, any>
  ) {
    if (params.company) {
      return query.andWhere('company.groupId = :company', {
        company: params.company
      })
    }
    if (params.companiesGroups) {
      return query.andWhere('companyGroup.id = :id', {
        id: params.companiesGroups
      })
    }
    return query
  }

  public async find({ limit, page, column, sort }, query: UserQuery = {}) {
    const _handleQuery = () => {
      const where = this.$query.handle(query)
      if ('name' in where) {
        return [
          { ...omit(where, 'name'), firstName: where.name },
          { ...omit(where, 'name'), lastName: where.name }
        ]
      }
      return where
    }

    const where = _handleQuery()
    const base = this.$getRepo()
      .createQueryBuilder('user')
      .leftJoinAndSelect('user._companies', 'companies')
      .leftJoinAndSelect('user.companiesGroups', 'companyGroup')
      .leftJoinAndSelect('user._retails', 'retails')
      .leftJoinAndSelect('retails.group', 'retailGroup')
      .innerJoinAndSelect('user.role', 'role')
      .where(
        (() => {
          function _handle(item) {
            return omit(item, 'company', 'retail', 'companiesGroups')
          }

          if (Array.isArray(where)) return where.map(_handle)
          return _handle(where)
        })()
      )

    let command = this.setByCompanyQuery(
      this.setByRetailQuery(base, where),
      where
    )
    const countCommand = command
    console.log(command.getQueryAndParameters())

    if (column !== 'groups') {
      if (column === 'role') {
        command = command.orderBy(`role.description`, sort.toUpperCase())
      } else if (column === 'name') {
        command = command
          .orderBy(`user.firstName`, sort.toUpperCase())
          .addOrderBy(`user.lastName`, sort.toUpperCase())
      } else {
        command = command.orderBy(`user.${column}`, sort.toUpperCase())
      }
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
      items:
        column === 'groups'
          ? orderBy(items, ['_companies', '_retails'], sort)
          : items,
      pagination: {
        totalPages,
        totalItems: count,
        page,
        limit
      }
    }
    if (found.items.length) return found
    throw new AppError($errors.notFound, { entity: 'user', query: where })
  }

  public async findFilterOptions() {
    const [retails, companies] = await Promise.all([
      this.$userRetail.findGroups(),
      this.$userCompany.findGroups()
    ])

    return { companies, retails }
  }

  public async findOne(query: UserQuery) {
    const where = this.$query.handle(query)

    const found = await this.$getRepo()
      .createQueryBuilder('user')
      .addSelect('user.createdAt')
      .addSelect('user.languageId')
      .where(where)
      .innerJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .leftJoinAndSelect('user._companies', 'companies')
      .leftJoinAndSelect('user.companiesGroups', 'companyGroup')
      .leftJoinAndSelect('user._retails', 'retails')
      .leftJoinAndSelect('retails.group', 'retailGroup')
      .getOne()

    if (found) return found

    throw new AppError($errors.notFound, { entity: 'user', query: where })
  }

  public async findOneSignIn(query: UserQuery) {
    const where = this.$query.handle(query)

    const found = await this.$getRepo()
      .createQueryBuilder('user')
      .addSelect('user.createdAt')
      .addSelect('user.languageId')
      .where(where)
      .innerJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .leftJoinAndSelect('user._companies', 'companies')
      .leftJoinAndSelect('companies.group', 'companyGroup')
      .leftJoinAndSelect('user._retails', 'retails')
      .leftJoinAndSelect('retails.group', 'retailGroup')
      .getOne()

    if (found) return found

    throw new AppError($errors.notFound, { entity: 'user', query: where })
  }

  public async findOneOrNull(query: UserQuery) {
    try {
      const found = await this.$getRepo()
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('user._companies', 'companies')
        .leftJoinAndSelect('companies.group', 'companyGroup')
        .leftJoinAndSelect('companyGroup.companies', '_c')
        .leftJoinAndSelect('user._retails', 'retails')
        .leftJoinAndSelect('retails.group', 'retailGroup')
        .leftJoinAndSelect('retailGroup.retails', '_r')
        .where(query)
        .getOne()
      return found
    } catch (_) {
      return null
    }
  }

  public async insertOne(
    payload: UserPayload,
    permissions: Record<string, any>
  ): Promise<User> {
    const repo = this.$getRepo()

    const pwd = await this.$cypher.encrypt(payload.password)

    const [docDuplicated, emailDuplicated, phoneDuplicated] = await Promise.all(
      [
        repo.findOne({ ...pick(payload, 'CPF') }, { withDeleted: false }),
        repo.findOne({ ...pick(payload, 'email') }, { withDeleted: false }),
        repo.findOne({ ...pick(payload, 'phone') }, { withDeleted: false })
      ]
    )
    if (docDuplicated) throw new AppError($errors.duplicated, 'CPF')
    if (emailDuplicated) throw new AppError($errors.duplicated, 'email')
    if (phoneDuplicated) throw new AppError($errors.duplicated, 'phone')

    const companiesGroups = (payload.companiesGroups || []).map((e) => ({
      ...e
    }))

    const created = repo.create({
      ...omit(payload, 'companies', 'retails', 'password'),
      companiesGroups,
      pwd
    })
    await repo.save(created)

    const permissionsCreated = await this.$userPermission.insertInCreateUser(
      created.id,
      permissions
    )

    return {
      ...created,
      permissions: permissionsCreated
    } as any
  }

  private projectRelationsUpdate(
    stored: { id: string }[],
    payload: { id: string }[]
  ) {
    const partial = stored.map(({ id }) => {
      const i = payload.findIndex(({ id: payloadId }) => payloadId === id)
      return { id, toRemove: i < 0 }
    })

    const toRemove = partial
      .filter(({ toRemove }) => toRemove)
      .map(({ id }) => id)

    const toCreate = payload
      .filter(({ id }) => {
        const i = stored.findIndex(({ id: storedId }) => storedId === id)
        return i < 0
      })
      .map(({ id }) => id)

    return { toCreate, toRemove }
  }

  private mapRawRelations(raw?: string[]) {
    if (!raw) return []
    return raw.map((each) => ({ id: each }))
  }

  private projectRelationsGroupId(raw?: (UserCompany | UserRetail)[]) {
    if (!raw || !raw.length) return []
    return raw
      .filter(({ group }) => group)
      .map((each) => ({ id: each.group.id }))
  }

  public async updateOne(payload: Partial<UserPayload> & { id: string }) {
    const repo = this.$getRepo()
    const { id, CPF, email, phone } = payload

    const found = await repo.findOne({ id }, { withDeleted: false })
    if (!found) throw new AppError($errors.notFound, { where: { id } })

    if (CPF && email && phone) {
      const [docDuplicated, emailDuplicated, phoneDuplicated] =
        await Promise.all([
          repo.findOne({ CPF, id: Not(id) }, { withDeleted: false }),
          repo.findOne({ email, id: Not(id) }, { withDeleted: false }),
          repo.findOne({ phone, id: Not(id) }, { withDeleted: false })
        ])
      if (docDuplicated) throw new AppError($errors.duplicated, 'CPF')
      if (emailDuplicated) throw new AppError($errors.duplicated, 'email')
      if (phoneDuplicated) throw new AppError($errors.duplicated, 'phone')
    }

    const { toCreate: toCreateCompanies, toRemove: toRemoveCompanies } =
      this.projectRelationsUpdate(
        this.projectRelationsGroupId(found._companies),
        this.mapRawRelations(payload.companies)
      )

    const { toCreate: toCreateRetails, toRemove: toRemoveRetails } =
      this.projectRelationsUpdate(
        this.projectRelationsGroupId(found._retails),
        this.mapRawRelations(payload.retails)
      )

    const _data = {
      ...omit(found, 'role', 'language'),
      ...payload,
      id
    }

    if (payload.password) {
      const pwd = await this.$cypher.encrypt(payload.password)
      Object.assign(_data, { pwd })
    }

    const updated = await repo.save(_data)
    await Promise.all([
      Promise.all(
        toRemoveCompanies.map((groupId) => {
          return this.$userCompany.removeOne(
            { userId: found.id, groupId },
            { shouldThrow: false }
          )
        })
      ),
      Promise.all(
        toRemoveRetails.map((groupId) => {
          return this.$userRetail.removeOne(
            { userId: found.id, groupId },
            { shouldThrow: false }
          )
        })
      ),
      Promise.all(
        toCreateCompanies.map((groupId) => {
          return this.$userCompany.insertOne(
            { userId: found.id, groupId },
            { shouldThrow: false }
          )
        })
      ),
      Promise.all(
        toCreateRetails.map((groupId) => {
          return this.$userRetail.insertOne(
            { userId: found.id, groupId },
            { shouldThrow: false }
          )
        })
      )
    ])

    return updated
  }

  public async updateLastSignIn({
    id,
    lastSignIn
  }: {
    id: string
    lastSignIn: Date
  }) {
    const repo = this.$getRepo()

    const found = await repo.findOne({ id }, { withDeleted: false })
    if (!found) throw new AppError($errors.notFound, { where: { id } })

    const updated = await repo.save({
      lastSignIn,
      id
    })

    return updated
  }

  public async updatePassword(newPasswordData: UserPassword) {
    const repo = this.$getRepo()
    const user = await repo.findOne(
      { id: newPasswordData.id },
      { withDeleted: false }
    )

    if (!user)
      throw new AppError($errors.notFound, {
        where: { id: newPasswordData.id }
      })

    const isValidPass = await this.$cypher.check(
      newPasswordData.currentPassword,
      user.pwd
    )

    if (!isValidPass) throw new AppError($errors.invalidPassword)

    const pwd = await this.$cypher.encrypt(newPasswordData.password)

    const updated = await repo.save({ ...user, pwd })

    return updated
  }

  public async removeOne(query: UserQuery) {
    const found = await this.findOne(query)
    return this.$getRepo().softDelete({ id: found.id })
  }
}
