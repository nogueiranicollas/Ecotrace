import { AuthReq, Req } from '@/Shared/Protocols'
import { TraceabilityFilter } from '@/Domain/TraceabilityFilter'
import { Repository } from './order.repository'

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

  public async find(req: Req): Promise<Record<string, any>> {
    const { filters, ...options } = await this.$filters.handle(req)
    const {
      user: { accesses }
    } = req as AuthReq
    const found = await this.$repo.find(options, filters, accesses)
    return found
  }

  public async getOrderChartDelayedByMonth(
    req: Req
  ): Promise<Record<string, any>> {
    const { filters, ...options } = await this.$filters.handle(req)
    const {
      user: { accesses }
    } = req as AuthReq
    const found = await this.$repo.getOrderChartDelayedByMonth(
      options,
      filters,
      accesses
    )
    return found
  }

  public async getOrderChartBySupplier(req: Req): Promise<Record<string, any>> {
    const { filters, ...options } = await this.$filters.handle(req)
    const {
      user: { accesses }
    } = req as AuthReq
    const found = await this.$repo.getOrderChartBySupplier(
      options,
      filters,
      accesses
    )
    return found
  }

  public async getOrderChartDeliveredOpenByMonth(
    req: Req
  ): Promise<Record<string, any>> {
    const { filters, ...options } = await this.$filters.handle(req)
    const {
      user: { accesses }
    } = req as AuthReq
    const found = await this.$repo.getOrderChartDeliveredOpenByMonth(
      options,
      filters,
      accesses
    )
    return found
  }

  public async getOrderChartByOrigin(req: Req): Promise<Record<string, any>> {
    const { filters, ...options } = await this.$filters.handle(req)
    const {
      user: { accesses }
    } = req as AuthReq
    const found = await this.$repo.getOrderChartByOrigin(
      options,
      filters,
      accesses
    )
    return found
  }

  public async getOrderCards(req: Req): Promise<Record<string, any>> {
    const { filters, ...options } = await this.$filters.handle(req)
    const {
      user: { accesses }
    } = req as AuthReq
    const found = await this.$repo.getOrderCards(options, filters, accesses)
    return found
  }
}
