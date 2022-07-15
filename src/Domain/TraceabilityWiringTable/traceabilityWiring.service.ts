import { Req } from '@/Shared/Protocols'
import { productiveChainFilter as ProductiveChainFilter } from '@/Domain/ProductiveChainFilter'
import { Repository } from './traceabilityWiring.repository'

import { Validator } from './traceabilityWiring.validator'

export class Service {
  private $repo: Repository
  private $filters: ProductiveChainFilter
  private $validator: typeof Validator

  constructor({
    $Repository = Repository,
    $ProductiveChainFilter = ProductiveChainFilter,
    $Validator = Validator
  } = {}) {
    this.$repo = new $Repository()
    this.$filters = new $ProductiveChainFilter()
    this.$validator = $Validator
  }

  public async findWiring(req: Req): Promise<Record<string, any>> {
    const { filters, ...options } = await this.$filters.handle(req)

    const _filters = filters

    const found = await this.$repo.findTraceabilityWiring(options, _filters)

    return found
  }
}
