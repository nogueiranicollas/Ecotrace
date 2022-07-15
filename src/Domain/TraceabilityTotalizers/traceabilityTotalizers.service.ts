import { Req } from '@/Shared/Protocols'
import { productiveChainFilter as ProductiveChainFilter } from '@/Domain/ProductiveChainFilter'
import { Repository } from './traceabilityTotalizers.repository'

import { Validator } from './traceabilityTotalizers.validator'

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

  public async findTotalizers(req: Req): Promise<Record<string, any>> {
    const { filters, ...options } = await this.$filters.handle(req)

    const _filters = filters

    const found = await this.$repo.findTotalizers(options, _filters)

    return found
  }
}
