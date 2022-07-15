import { Req } from '@/Shared/Protocols'
import { TraceabilityFilter } from '@/Domain/TraceabilityFilter'
import { Repository } from './traceabilitySumary.repository'

import { Validator } from './traceabilitySumary.validator'

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

  public async findSumary(req: Req): Promise<Record<string, any>> {
    const { filters, ...options } = await this.$filters.handle(req)

    const _filters = filters

    const found = await this.$repo.findTraceabilitySumary(options, _filters)

    return found
  }
}
