import { Req } from '@/Shared/Protocols'

import { Retail as Entity } from './retail.entity'
import { Validator } from './retail.validator'
import { Repository, RetailPayload } from './retail.repository'

export class Service {
  private $repo: Repository
  private $validator: Validator

  constructor({ $Validator = Validator, $Repository = Repository } = {}) {
    this.$repo = new $Repository()
    this.$validator = new $Validator()
  }

  public async find(req: Req) {
    const { limit = 10, page = 0, column = 'name', sort = 'asc' } = req.query
    const { payload, validationErrors } = await this.$validator.validateQuery(
      req
    )
    if (!payload) throw validationErrors

    const found = await this.$repo.find(
      { page: Number(page), limit: Number(limit), column, sort },
      payload
    )
    return found
  }

  public async findOne(req: Req): Promise<Entity> {
    const { payload, validationErrors } = await this.$validator.validateParams<{
      id: string
    }>(req)
    if (!payload) throw validationErrors

    const found = await this.$repo.findOne(payload)
    return found as Entity
  }

  public async insertOne(req: Req): Promise<Entity> {
    const { payload, validationErrors } =
      await this.$validator.validateBody<RetailPayload>(req)
    if (!payload) throw validationErrors
    const created = await this.$repo.insertOne(payload)
    return created
  }

  public async updateOne(req: Req): Promise<Entity> {
    const [
      { payload: params, validationErrors: paramValidationErrors },
      { payload, validationErrors: bodyValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams(req),
      this.$validator.validateBody(req)
    ])
    if (!params) throw paramValidationErrors
    if (!payload) throw bodyValidationErrors

    const updated = await this.$repo.updateOne({ ...payload, ...params })
    return updated
  }

  public async findByGroup(req: Req) {
    const { limit = 10, page = 0 } = req.query
    const [
      { payload: params, validationErrors: paramsValidationErrors },
      { payload: qs, validationErrors: qsValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams<{ groupId: string }>(req),
      this.$validator.validateQuery<{
        name: string
        fancyName: string
        cnpj: string
      }>(req)
    ])
    if (!params) throw paramsValidationErrors
    if (!qs) throw qsValidationErrors

    return this.$repo.findByGroup(
      { page: Number(page), limit: Number(limit) },
      { ...params, ...qs }
    )
  }

  public async findUnrelatedWithGroup(req: Req) {
    const { limit = 10, page = 0 } = req.query
    const [
      { payload: params, validationErrors: paramsValidationErrors },
      { payload: qs, validationErrors: qsValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams<{ groupId: string }>(req),
      this.$validator.validateQuery<{ name: string; cnpj: string }>(req)
    ])
    if (!params) throw paramsValidationErrors
    if (!qs) throw qsValidationErrors

    return this.$repo.findUnrelatedWithGroup(
      { page: Number(page), limit: Number(limit) },
      { ...params, ...qs }
    )
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
