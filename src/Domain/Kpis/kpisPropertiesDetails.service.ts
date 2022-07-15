import { AuthReq, Req } from '@/Shared/Protocols'
import { TraceabilityFilter } from '@/Domain/TraceabilityFilter'
import { Repository } from './kpisPropertiesDetails.repository'

export class Service {
  private $repo: Repository
  private $filters: TraceabilityFilter

  constructor({
    $Repository = Repository,
    $TraceabilityFilter = TraceabilityFilter
  } = {}) {
    this.$repo = new $Repository()
    this.$filters = new $TraceabilityFilter()
  }

  public async findDetails(req: Req): Promise<Record<string, any>> {
    const { filters, ...options } = await this.$filters.handle(req)
    const {
      user: { accesses }
    } = req as AuthReq
    const found = await this.$repo.findPropertiesDetails(
      options,
      filters,
      accesses
    )
    return found
  }
}
