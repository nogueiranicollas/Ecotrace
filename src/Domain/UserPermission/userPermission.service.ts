import { Req } from '@/Shared/Protocols'

import { UserPermissions as Entity } from './userPermission.entity'
import { Validator } from './userPermission.validator'

import { Repository, UserPermissionPayload } from './userPermission.repository'

export class Service {
  private $repo: Repository
  private $validator: Validator

  constructor({ $Validator = Validator, $Repository = Repository } = {}) {
    this.$repo = new $Repository()
    this.$validator = new $Validator()
  }

  public async find(_req: Req): Promise<Entity[]> {
    const found = await this.$repo.find()
    return found
  }

  public async findOne(req: Req): Promise<Entity> {
    const { userId } = req.params

    const found = await this.$repo.findOne(userId)
    return found
  }

  public async insertOne(req: Req): Promise<void | Entity> {
    const { payload, validationErrors } =
      await this.$validator.validateBody<void | UserPermissionPayload>(req)
    if (!payload) throw validationErrors

    const created = await this.$repo.insertOne(payload)
    return created
  }

  public async insertinCreateUser(req: Req): Promise<Entity> {
    const { payload, validationErrors } =
      await this.$validator.validateBody<void | UserPermissionPayload>(req)
    if (!payload) throw validationErrors

    // const created = await this.$repo.insertInCreateUser(payload)
    return payload
  }

  public async update(req: Req): Promise<Entity> {
    const { payload, validationErrors } =
      await this.$validator.validateBody<UserPermissionPayload>(req)
    if (!payload) throw validationErrors

    const updated = await this.$repo.updateOne(payload)
    return updated
  }
}
