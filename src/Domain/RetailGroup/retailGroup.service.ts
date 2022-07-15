import { Req } from '@/Shared/Protocols'

import { RetailGroup as Entity } from './retailGroup.entity'
import { Validator } from './retailGroup.validator'
import { Repository, RetailGroupPayload } from './retailGroup.repository'

export class Service {
  private $repo: Repository
  private $validator: Validator

  constructor({ $Validator = Validator, $Repository = Repository } = {}) {
    this.$repo = new $Repository()
    this.$validator = new $Validator()
  }

  public async find(req: Req) {
    const { limit = 10, page = 0 } = req.query
    const { payload, validationErrors } = await this.$validator.validateQuery(
      req
    )
    if (!payload) throw validationErrors

    const found = await this.$repo.find(
      { page: Number(page), limit: Number(limit) },
      payload
    )
    return found
  }

  public async findOne(req: Req) {
    const { limit = 10, page = 0 } = req.query
    const { payload, validationErrors } = await this.$validator.validateParams<{
      id: string
    }>(req)
    if (!payload) throw validationErrors

    const found = await this.$repo.findOne(
      { page: Number(page), limit: Number(limit) },
      payload
    )
    return found
  }

  public async insertOne(req: Req): Promise<Entity> {
    const { payload, validationErrors } =
      await this.$validator.validateBody<RetailGroupPayload>(req)
    if (!payload) throw validationErrors

    const created = await this.$repo.insertOne(payload)
    return created
  }

  public async updateOne(req: Req): Promise<Entity> {
    const [
      { payload: params, validationErrors: paramsValidationErrors },
      { payload, validationErrors: bodyValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams(req),
      this.$validator.validateBody(req)
    ])
    if (!params) throw paramsValidationErrors
    if (!payload) throw bodyValidationErrors

    const updated = await this.$repo.updateOne({ ...payload, ...params })
    return updated
  }

  public async linkWithRetails(req: Req): Promise<Entity> {
    const [
      { payload: params, validationErrors: paramsValidationErrors },
      { payload, validationErrors: payloadValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams<{ id: string }>(req),
      this.$validator.validate<{ retailIds: string[] }>(
        req.body,
        Validator.schemas.linkRetails
      )
    ])
    if (!params) throw paramsValidationErrors
    if (!payload) throw payloadValidationErrors

    return await this.$repo.linkWithRetails({ ...params, ...payload })
  }

  public async unlinkWithRetails(req: Req): Promise<Entity> {
    const [
      { payload: params, validationErrors: paramsValidationErrors },
      { payload, validationErrors: payloadValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams<{ id: string }>(req),
      this.$validator.validate<{ retailIds: string[] }>(
        req.body,
        Validator.schemas.linkRetails
      )
    ])
    if (!params) throw paramsValidationErrors
    if (!payload) throw payloadValidationErrors

    return await this.$repo.unlinkWithRetails({ ...params, ...payload })
  }

  public async removeOne(req: Req): Promise<string> {
    const { payload, validationErrors } = await this.$validator.validateParams<{
      id: string
    }>(req)
    if (!payload) throw validationErrors

    await this.$repo.removeOne(payload)
    return payload.id
  }
}
