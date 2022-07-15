import { Req } from '@/Shared/Protocols'

import { validator } from './productiveChainFilter.validator'

export type FiltersPayload = {
  ibgeId?: string
  datestart?: Date
  dateend?: Date
  order?: boolean
  invoice?: boolean
  production?: boolean
  deliveryEstimate?: boolean
  suppliercnpj?: string
  suppliername?: string
  retail?: boolean
  provider?: boolean
  weaving?: boolean
  wiring?: boolean
  property?: boolean
  companyGroups?: Array<string>
  orderNumber?: string
  invoiceNumber?: string
  qrCode?: string
}

export class productiveChainFilter {
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
