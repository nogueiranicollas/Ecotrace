import { Req } from '@/Shared/Protocols'

import { validator } from './traceabilityFilter.validator'

export type FiltersPayload = {
  datestart?: Date
  dateend?: Date
  dateselection?: string
  ordernumber?: string
  invoice?: string
  productcode?: string
  confectioncnpj?: string
  originsupplier?: string
  orderstatus?: string
  isabrcertified?: string
  car?: string
}

export class TraceabilityFilter {
  private $validator: typeof validator

  constructor({ $validator = validator } = {}) {
    this.$validator = $validator
  }

  async handle(req: Req) {
    const {
      limit = 10,
      page = 0,
      column = 'order',
      direction = 'asc'
    } = req.query

    const { payload: filters, validationErrors } =
      await this.$validator.validateQuery<FiltersPayload>(req)
    if (!filters) throw validationErrors

    return {
      page: Number(page),
      limit: Number(limit),
      column,
      direction,
      filters
    }
  }
}
