import { Req } from '@/Shared/Protocols'
import { PropertyProducer } from './propertyProducers.entity'

import { Repository } from './propertyProducers.repository'
import { schemas } from './propertyProducers.schemas'

import { Validator } from './propertyProducers.validator'

type PropertyProducerValidate = {
  blockStatus: boolean
  CAR: string
  CPFCNPJ: string
  name: string
  producer: string
  state: string
}

export class Service {
  private $repo: Repository
  private $validator: typeof Validator

  constructor({ $Validator = Validator, $Repository = Repository } = {}) {
    this.$repo = new $Repository()
    this.$validator = $Validator
  }

  public async find(req: Req) {
    if (req.query.blockStatus) {
      req.query.blockStatus = String(req.query.blockStatus === 'B')
    }

    const {
      limit = 10,
      page = 0,
      column = 'CAR',
      direction = 'asc'
    } = req.query
    const { payload, validationErrors } =
      await this.$validator.validateQuery<PropertyProducerValidate>(req)
    if (!payload) throw validationErrors

    const found = await this.$repo.find(
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
    return this.$repo.findById(payload) as Promise<PropertyProducer>
  }

  public async findByPropertyId(req: Req) {
    const { payload, validationErrors } = await this.$validator.validate<{
      propertyId: string
    }>(req.params, schemas.property)
    if (!payload) throw validationErrors
    return this.$repo.findByPropertyId(payload) as Promise<PropertyProducer[]>
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
