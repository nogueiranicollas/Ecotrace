import { Req } from '@/Shared/Protocols'

import { Repository } from './propertyLog.repository'

import { Validator } from './propertyLog.validator'

type PropertyLogValidate = {
  propertyId: string
  producerId: string
}

export class Service {
  private $repo: Repository
  private $validator: typeof Validator

  constructor({ $Validator = Validator, $Repository = Repository } = {}) {
    this.$repo = new $Repository()
    this.$validator = $Validator
  }

  public async find(req: Req) {
    const {
      limit = 10,
      page = 0,
      column = 'updated_at',
      direction = 'desc'
    } = req.query
    const { payload, validationErrors } =
      await this.$validator.validateQuery<PropertyLogValidate>(req)
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
}
