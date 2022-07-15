import { AuthReq, Req } from '@/Shared/Protocols'

import { Repository, OrderQuery } from './traceability.repository'
import { Validator } from './traceability.validator'
import { FiltersPayload } from '../TraceabilityFilter/traceabilityFilter.service'

export class Service {
  private $repo: Repository
  private $validator: typeof Validator

  constructor({ $Validator = Validator, $Repository = Repository } = {}) {
    this.$repo = new $Repository()
    this.$validator = $Validator
  }

  public async find(req: Req): Promise<Record<string, any>> {
    const { payload, validationErrors } =
      await this.$validator.validateQuery<OrderQuery>(req)
    if (!payload) throw validationErrors

    const {
      user: { accesses }
    } = req as AuthReq
    const found = await this.$repo.findOrdersKpi(payload, accesses)
    return found
  }
}
