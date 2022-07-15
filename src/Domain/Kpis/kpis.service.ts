import { AuthReq, Req } from '@/Shared/Protocols'
import { TraceabilityFilter } from '@/Domain/TraceabilityFilter'
import { Repository } from './kpis.repository'

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
}
