import { Req } from '@/Shared/Protocols'

import { CompanyGroup } from './companyGroup.entity'
import { CompanyGroupPayload, Repository } from './companyGroup.repository'
import { Validator } from './companyGroup.validator'

export class Service {
  private $repo: Repository
  private $validator: Validator

  constructor({ $Validator = Validator, $Repository = Repository } = {}) {
    this.$repo = new $Repository()
    this.$validator = new $Validator()
  }

  public async find(req: Req) {
    const { limit = 10, page = 0 } = req.query
    const { payload: query } = await this.$validator.validateQuery<{
      adminEmail: string
      description: string
    }>(req)

    const found = await this.$repo.find(
      { page: Number(page), limit: Number(limit) },
      query || {}
    )
    return found
  }

  public async findAccessReleaseOnly(req: Req) {
    const { limit = 100, page = 0 } = req.query
    const { payload: query } = await this.$validator.validateQuery<{
      adminEmail: string
      description: string
    }>(req)

    const found = await this.$repo.findAccessReleaseOnly(
      { page: Number(page), limit: Number(limit) },
      query || {}
    )
    return found
  }

  public async findOne(req: Req) {
    const { limit = 10, page = 0 } = req.query
    const { id } = req.params

    const found = await this.$repo.findOne(
      { page: Number(page), limit: Number(limit) },
      { id }
    )
    return found
  }

  public async insertOne(req: Req): Promise<CompanyGroup> {
    const { payload, validationErrors } =
      await this.$validator.validateBody<CompanyGroupPayload>(req)
    if (!payload) throw validationErrors

    const created = await this.$repo.insertOne(payload)
    return created
  }

  public async updateOne(req: Req): Promise<CompanyGroup> {
    const [
      { payload: params, validationErrors: paramValidationErrors },
      { payload, validationErrors: bodyValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams<{ id: string }>(req),
      this.$validator.validateBody<CompanyGroupPayload>(req)
    ])
    if (!params) throw paramValidationErrors
    if (!payload) throw bodyValidationErrors

    const updated = await this.$repo.updateOne({ ...payload, ...params })
    return updated
  }

  public async linkWithCompanies(req: Req): Promise<CompanyGroup> {
    const [
      { payload: params, validationErrors: paramsValidationErrors },
      { payload, validationErrors: payloadValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams<{ id: string }>(req),
      this.$validator.validate<{ companyIds: string[] }>(
        req.body,
        Validator.schemas.linkCompanies
      )
    ])
    if (!params) throw paramsValidationErrors
    if (!payload) throw payloadValidationErrors

    return await this.$repo.linkWithCompanies({ ...params, ...payload })
  }

  public async unlinkWithCompanies(req: Req): Promise<CompanyGroup> {
    const [
      { payload: params, validationErrors: paramsValidationErrors },
      { payload, validationErrors: payloadValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams<{ id: string }>(req),
      this.$validator.validate<{ companyIds: string[] }>(
        req.body,
        Validator.schemas.linkCompanies
      )
    ])
    if (!params) throw paramsValidationErrors
    if (!payload) throw payloadValidationErrors

    return await this.$repo.unlinkWithCompanies({ ...params, ...payload })
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
