import { PGDB } from '@/Shared/Database/knex'
import { Accesses, AppError } from '@/Shared/Protocols'
import {
  $errors,
  getTypeORMCustomRepo,
  joinWithConditions,
  QueryUtil
} from '@/Shared/Utils'
import { getConditions } from '@/Shared/Utils/traceabilityTable/getConditions'
import { getListRowsQuery } from '@/Shared/Utils/traceabilityTable/getListRowsQuery'
import { fetchList, fetchListTeste, fetchListWithoutPagination } from '@/Shared/Utils/traceabilityTable/fetchList'
import { countList } from '@/Shared/Utils/traceabilityTable/countList'
import { FiltersPayload } from '../ProductiveChainFilter/productiveChainFilter.service'
import { QUERY_COLLECTION_PRODUCTIVE_CHAIN } from './productiveChain.query'
import { ProductiveChain, OrderSummary } from './productiveChain.entity'
import { Reference } from '@/Domain/Reference/reference.entity'
import { User } from '@/Domain/User/user.entity'
import { ACTION } from './productiveChain.enum'
import {
  EntityRepository,
  FindConditions,
  Like,
  Not,
  Repository as _Repository
} from 'typeorm'
import { omit } from 'lodash'
import { City as CityRepo } from '@/Domain/City/city.service'
import { getRepo as ReferenceRepo } from '@/Domain/Reference/reference.repository'

export type ProductiveChainQuery = FiltersPayload

type ProductiveChainQueryCUstom = FindConditions<ProductiveChain> | FindConditions<ProductiveChain>[]

export type ProductiveChainPayload = Omit<ProductiveChain, 'id' | 'createdAt' | 'updatedAt'>
interface ProductiveChainRepo extends _Repository<ProductiveChain> {}

const columns = {
  order: 'orderNumber',
  itemCode: 'itemCode'
}

const NON_EXACT_KEYS = []

@EntityRepository(ProductiveChain)
class TypeORMRepo extends _Repository<ProductiveChain> implements ProductiveChainRepo {}

export class Repository {
  private $client: PGDB

  private $getRepo: () => ProductiveChainRepo

  private $query: QueryUtil

  constructor({
    $PGDB = PGDB,
    repo = getTypeORMCustomRepo<ProductiveChainRepo>(TypeORMRepo),
    $Query = QueryUtil
  } = {}) {
    this.$client = new $PGDB()
    this.$getRepo = repo
    this.$query = new $Query(NON_EXACT_KEYS)
  }

  public async findProductiveChain(
    { limit, page, column, direction },
    filters: ProductiveChainQuery = {},
    accesses?: Accesses
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }

    const data = {
      orderSummary:[],
      retail:[],
      provider:[],
      weaving:[],
      wiring:[],
      property:[]
  }

    const [orders] = await Promise.all([await this.findOrderSummary({ limit, page, column:'order', direction }, filters, accesses)])
    data.orderSummary = orders.orders.map(order => { return order })

    const [retails] = await Promise.all([await this.findRetail({ limit, page, column:'order', direction }, filters, accesses)])
    data.retail = retails.retails.map(retail => { return retail })

    const [providers] = await Promise.all([await this.findProvider({ limit, page, column:'order', direction }, filters, accesses)])
    data.provider = providers.providers.map(provider => { return provider })

    const [weavings] = await Promise.all([await this.findWeaving({ limit, page, column:'order', direction }, filters, accesses)])
    data.weaving = weavings.weavings.map(weaving => { return weaving })

    const [wirings] = await Promise.all([await this.findWiring({ limit, page, column:'order', direction }, filters, accesses)])
    data.wiring = wirings.wirings.map(wiring => { return wiring })

    const [properties] = await Promise.all([await this.findProperty({ limit, page, column:'order', direction }, filters, accesses)])
    data.property = properties.properties.map(property => { return property })

    

    

    

    const found = {
      data
    }

    return found
  }

  public async findOrderSummary(
    { limit, page, column, direction },
    filters: ProductiveChainQuery = {},
    accesses?: Accesses
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'orderSummary'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_PRODUCTIVE_CHAIN,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_PRODUCTIVE_CHAIN,
      target
    })

    const [orders] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])


    
    await Promise.all(orders.map(async (order) => {
      let orderItens = await this.findOrderItens({ limit, page, column:'itemCode', direction },filters, accesses)
      order.orderitens = orderItens.orderItens
    }))

    const found = {
        orders
    }

    return found
  }

  public async findOrderItens(
    { limit, page, column, direction },
    filters: ProductiveChainQuery = {},
    accesses?: Accesses
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'orderItens'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_PRODUCTIVE_CHAIN,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_PRODUCTIVE_CHAIN,
      target
    })


    // if (!filters.locations) {
    const [orderItens] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      orderItens
    }

    return found
  }

  public async findRetail(
    { limit, page, column, direction },
    filters: ProductiveChainQuery = {},
    accesses?: Accesses
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'retail'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_PRODUCTIVE_CHAIN,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_PRODUCTIVE_CHAIN,
      target
    })

    const [retails] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])


    const found = {
        retails
    }

    return found
  }

  public async findProvider(
    { limit, page, column, direction },
    filters: ProductiveChainQuery = {},
    accesses?: Accesses
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'provider'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_PRODUCTIVE_CHAIN,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_PRODUCTIVE_CHAIN,
      target
    })

    const [providers] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    await Promise.all(providers.map(async (provider) => {
      let providerOutsources = await this.findProviderOutsource({ limit, page, column:'order', direction },filters, accesses)
      provider.providerOutsource = providerOutsources.providerOutsources

      provider.providerCertificationsAbbreviations = []
      provider.providerCertifications = []
    }))




    const found = {
      providers
    }

    return found
  }

  public async findProviderOutsource(
    { limit, page, column, direction },
    filters: ProductiveChainQuery = {},
    accesses?: Accesses
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'providerOutsource'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_PRODUCTIVE_CHAIN,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_PRODUCTIVE_CHAIN,
      target
    })

    const [providerOutsources] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    await Promise.all(providerOutsources.map(async (providerOutsource) => {
      // let orderItens = await this.findOrderItens({ limit, page, column:'itemCode', direction },filters, accesses)
      providerOutsource.providerCertificationsAbbreviations = []
      providerOutsource.providerCertifications = []
    }))




    const found = {
      providerOutsources
    }

    return found
  }

  public async findWeaving(
    { limit, page, column, direction },
    filters: ProductiveChainQuery = {},
    accesses?: Accesses
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'weaving'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_PRODUCTIVE_CHAIN,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_PRODUCTIVE_CHAIN,
      target
    })

    const [weavings] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    await Promise.all(weavings.map(async (weaving) => {
      // let orderItens = await this.findOrderItens({ limit, page, column:'itemCode', direction },filters, accesses)
      weaving.weavingCertificationsAbbreviations = []
      weaving.weavingCertifications = []
      weaving.weavingOriginLine = []
      weaving.weavingChemical = []
      weaving.weavingComposition = []
    }))




    const found = {
      weavings
    }

    return found
  }

  public async findWiring(
    { limit, page, column, direction },
    filters: ProductiveChainQuery = {},
    accesses?: Accesses
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'wiring'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_PRODUCTIVE_CHAIN,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_PRODUCTIVE_CHAIN,
      target
    })

    const [wirings] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    await Promise.all(wirings.map(async (wiring) => {
      // let orderItens = await this.findOrderItens({ limit, page, column:'itemCode', direction },filters, accesses)
      wiring.wiringCertificationsAbbreviations = []
      wiring.wiringCertifications = []
      wiring.wiringChemical = []
      wiring.wiringComposition = []
    }))




    const found = {
      wirings
    }

    return found
  }

  public async findProperty(
    { limit, page, column, direction },
    filters: ProductiveChainQuery = {},
    accesses?: Accesses
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'property'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_PRODUCTIVE_CHAIN,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_PRODUCTIVE_CHAIN,
      target
    })

    const [properties] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    await Promise.all(properties.map(async (property) => {
      // let orderItens = await this.findOrderItens({ limit, page, column:'itemCode', direction },filters, accesses)
      property.propertyCertificationsAbbreviations = []
      property.propertyCertifications = []
    }))




    const found = {
      properties
    }

    return found
  }

}
