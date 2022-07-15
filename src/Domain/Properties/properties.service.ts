import { AuthReq, Req } from '@/Shared/Protocols'
import { TraceabilityFilter } from '@/Domain/TraceabilityFilter'
import { PropertyPayload, Repository } from './properties.repository'
import { Property } from './property.entity'
import { Producer } from '@/Domain/Producer/producer.entity'
import { Validator } from './property.validator'
import { schemas } from './property.schemas'

type PropertyValidate = {
  blockStatus: boolean
  CAR: string
  CPFCNPJ: string
  name: string
  producer: string
  state: string
  biome: string
}

export class Service {
  private $repo: Repository
  private $filters: TraceabilityFilter
  private $validator: typeof Validator

  constructor({
    $Repository = Repository,
    $TraceabilityFilter = TraceabilityFilter,
    $Validator = Validator
  } = {}) {
    this.$repo = new $Repository()
    this.$filters = new $TraceabilityFilter()
    this.$validator = $Validator
  }

  public async find(
    req: Req,
    locations: boolean
  ): Promise<Record<string, any>> {
    const { filters, ...options } = await this.$filters.handle(req)
    const {
      user: { accesses }
    } = req as AuthReq

    const _filters = locations ? { ...filters, locations: true } : filters

    const found = await this.$repo.find(options, _filters, accesses)
    return found
  }

  public async list(req: Req) {
    if (req.query.blockStatus) {
      req.query.blockStatus = String(req.query.blockStatus === 'B')
    }

    const {
      limit = 10,
      page = 0,
      column = 'name',
      direction = 'asc'
    } = req.query
    const { payload, validationErrors } =
      await this.$validator.validateQuery<PropertyValidate>(req)
    if (!payload) throw validationErrors

    const found = await this.$repo.list(
      {
        page: Number(page),
        limit: Number(limit),
        column,
        direction
      },
      payload
    )

    return found
  }

  public async findById(req: Req) {
    const { payload, validationErrors } = await this.$validator.validateParams<{
      id: string
    }>(req)
    if (!payload) throw validationErrors
    return this.$repo.findById(payload) as Promise<Property>
  }

  public async findByCAR(req: Req) {
    const { payload, validationErrors } = await this.$validator.validate<{
      CAR: string
    }>(req.params, schemas.CAR)
    if (!payload) throw validationErrors

    const { CAR } = payload

    return this.$repo.findByCAR(CAR) as Promise<Property>
  }

  public async insertOne(req: AuthReq): Promise<Property> {
    const { payload, validationErrors } =
      await this.$validator.validateBody<PropertyPayload>(req)
    if (!payload) throw validationErrors
    const { body, user } = req
    const created = await this.$repo.insertOne(body, user.bearer)
    return created
  }

  public async changingLockAllState(req: AuthReq): Promise<Property> {
    const [
      { payload: params, validationErrors: paramValidationErrors },
      { payload, validationErrors: bodyValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams(req),
      this.$validator.validate<{
        blockStatus: boolean
        reason: string
      }>(req.body, schemas.lockAllState)
    ])
    if (!params) throw paramValidationErrors
    if (!payload) throw bodyValidationErrors

    const { body, user } = req
    const updated = await this.$repo.changingLockAllState(
      { ...body, ...params },
      user.bearer
    )
    return updated
  }

  public async removeOne(req: Req): Promise<string> {
    const { payload, validationErrors } = await this.$validator.validateParams<{
      id: string
    }>(req)
    if (!payload) throw validationErrors

    await this.$repo.removeOne(payload)
    return payload.id
  }

  public async updateOne(req: AuthReq): Promise<Property> {
    const [
      { payload: params, validationErrors: paramValidationErrors },
      { payload, validationErrors: bodyValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams(req),
      this.$validator.validateBody(req)
    ])
    if (!params) throw paramValidationErrors
    if (!payload) throw bodyValidationErrors

    const { body, user } = req
    const updated = await this.$repo.updateOne(
      { ...body, ...params },
      user.bearer
    )
    return updated
  }

  public async import(req: AuthReq) {
    const { payload, validationErrors } = await this.$validator.validate<{
      propertiesTmpIds: string[]
    }>(req.body, schemas.propertyTmp)

    if (!payload) throw validationErrors
    const { user } = req
    const importProperties = await this.$repo.import(payload, user.bearer)
    return importProperties
  }

  public async addProducer(req: AuthReq): Promise<Property> {
    const [
      { payload: params, validationErrors: paramValidationErrors },
      { payload, validationErrors: bodyValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams(req),
      this.$validator.validate<{
        producers: Producer[]
      }>(req.body, schemas.producers)
    ])
    if (!params) throw paramValidationErrors
    if (!payload) throw bodyValidationErrors

    const { body, user } = req
    const updated = await this.$repo.addProducer(
      { ...body, ...params },
      user.bearer
    )
    return updated
  }

  public async changingLockState(req: AuthReq): Promise<Property> {
    const [
      { payload: params, validationErrors: paramValidationErrors },
      { payload, validationErrors: bodyValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams(req),
      this.$validator.validate<{
        producers: Producer[]
      }>(req.body, schemas.lockState)
    ])
    if (!params) throw paramValidationErrors
    if (!payload) throw bodyValidationErrors

    const { body, user } = req
    const updated = await this.$repo.changingLockState(
      { ...body, ...params },
      user.bearer
    )
    return updated
  }
}
