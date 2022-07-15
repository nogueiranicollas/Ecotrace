import { AppError, AuthReq, Req, WithFileReq } from '@/Shared/Protocols'
import { $errors, MulterUtils } from '@/Shared/Utils'

import { Service as FileService } from '@/Domain/File/file.service'

import { User as Entity } from './user.entity'
import { Repository as UserPermissionsRepo } from '@/Domain/UserPermission/userPermission.repository'
import { Validator } from './user.validator'
import { Validator as UserPermissionValidator } from '@/Domain/UserPermission/userPermission.validator'
import {
  Repository,
  UserPassword,
  UserPayload
  // UserPermissionPayload
} from './user.repository'
import { UserWithPermissions, Permissions } from './user.type'

export class Service {
  private $repo: Repository
  private $userPermissionsRepo: UserPermissionsRepo
  private $validator: Validator
  private $userPermissionValidator: UserPermissionValidator

  private $file: FileService

  constructor({
    $Validator = Validator,
    $UserpermissionValidator = UserPermissionValidator,
    $Repository = Repository,
    $File = FileService
  } = {}) {
    this.$repo = new $Repository()
    this.$userPermissionsRepo = new UserPermissionsRepo()
    this.$validator = new $Validator()
    this.$userPermissionValidator = new $UserpermissionValidator()
    this.$file = new $File()
  }

  public async find(req: Req) {
    const { limit = 10, page = 0, column = 'name', sort = 'asc' } = req.query
    const { payload: query, validationErrors } =
      await this.$validator.validateQuery(req)
    if (!query) throw validationErrors

    const found = await this.$repo.find(
      { page: Number(page), limit: Number(limit), column, sort },
      query
    )
    return found
  }

  public async findOne(req: Req): Promise<UserWithPermissions> {
    const { id } = req.params
    const query = { id }

    const found = await this.$repo.findOne(query)

    const permissions = (await this.$userPermissionsRepo.findOneSignIn(
      id
    )) as Permissions
    return { ...found, permissions } as UserWithPermissions
  }

  public async findFilterOptions() {
    return this.$repo.findFilterOptions()
  }

  public async insertOne(req: Req): Promise<Entity> {
    const { payload, validationErrors } =
      await this.$validator.validateBody<UserPayload>(req)

    if (!payload) throw validationErrors

    const permissions = payload.permissions

    if (
      !permissions.retail &&
      !permissions.provider &&
      !permissions.weaving &&
      !permissions.wiring &&
      !permissions.productiveChain &&
      !permissions.traceabilityProperty &&
      !permissions.blockchainHistory &&
      !permissions.users &&
      !permissions.industries &&
      !permissions.industriesGroup &&
      !permissions.propertyRegister
    ) {
      throw new AppError($errors.insufficientPermissions)
    }

    const created = await this.$repo.insertOne(payload, permissions)
    return created
  }

  public async updatePwd(req: AuthReq): Promise<Entity> {
    const { payload, validationErrors: bodyValidationErrors } =
      await this.$validator.validate<UserPassword>(
        req.body,
        Validator.schemas.updatePwd
      )
    if (!payload) throw bodyValidationErrors

    const updated = await this.$repo.updatePassword(payload)
    return updated
  }

  public async updateOne(req: Req): Promise<UserWithPermissions> {
    const [
      { payload: params, validationErrors: paramsValidationErrors },
      { payload, validationErrors: bodyValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams<{
        id: string
      }>(req),
      this.$validator.validateBody<UserPayload>(req)
    ])
    if (!params) throw paramsValidationErrors
    if (!payload) throw bodyValidationErrors

    const { id } = req.params

    const updated = await this.$repo.updateOne({ ...payload, id })
    payload.permissions.userId = updated.id
    const permissions = await this.$userPermissionsRepo.updateOne(
      payload.permissions
    )
    return { ...updated, permissions }
  }

  public async updateProfile(req: Req): Promise<Entity> {
    const [
      { payload: params, validationErrors: paramsValidationErrors },
      { payload, validationErrors: bodyValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams<{
        id: string
      }>(req),
      this.$validator.validate<UserPayload>(
        req.body,
        Validator.schemas.updateProfile
      )
    ])
    if (!params) throw paramsValidationErrors
    if (!payload) throw bodyValidationErrors

    const { id } = req.params

    const updated = await this.$repo.updateOne({ ...payload, id })
    return updated
  }

  public async uploadAvatar(req: WithFileReq): Promise<boolean> {
    const { id } = req.params
    const found = await this.$repo.findOne({ id })

    const file = MulterUtils.mapFilePayload(req)
    if (found.avatar) await this.$file.replaceOne(file, found.avatar)
    else {
      const newFile = await this.$file.insertOne(file)
      await this.$repo.updateOne({ ...found, avatar: newFile })
    }

    return true
  }

  public async removeOne(req: Req): Promise<string> {
    const { payload: params, validationErrors } =
      await this.$validator.validateParams<{ id: string }>(req)
    if (!params) throw validationErrors

    await this.$repo.removeOne(params)
    return params.id
  }
}
