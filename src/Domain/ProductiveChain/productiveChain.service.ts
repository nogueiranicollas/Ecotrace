import { AuthReq, Req } from '@/Shared/Protocols'
import { productiveChainFilter as ProductiveChainFilter } from '@/Domain/ProductiveChainFilter'
import { ProductiveChainPayload, Repository } from './productiveChain.repository'
import { ProductiveChain } from './productiveChain.entity'
import { Producer } from '@/Domain/Producer/producer.entity'
import { Validator } from './productiveChain.validator'
import { schemas } from './productiveChain.schemas'

type PropertyValidate = {
  blockStatus: boolean
  CAR: string
  CPFCNPJ: string
  name: string
  producer: string
  state: string
  biome: string
}

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

  // public async find(
  //   req: Req,
  //   locations: boolean
  // ): Promise<Record<string, any>> {
  //   const { filters, ...options } = await this.$filters.handle(req)
  //   const {
  //     user: { accesses }
  //   } = req as AuthReq

  //   const _filters = locations ? { ...filters, locations: true } : filters

  //   const found = await this.$repo.find(options, _filters, accesses)
  //   return found
  // }

  public async findTest(req: Req): Promise<Record<string, any>> {
    const { filters, ...options } = await this.$filters.handle(req)
    const {
      user: { accesses }
    } = req as AuthReq

    const _filters =  filters

    const found = await this.$repo.findProductiveChain(options, _filters, accesses)

    return found
  }


}
