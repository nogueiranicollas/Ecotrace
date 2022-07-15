import { PGDB } from '@/Shared/Database/knex'
import {} from '@/Shared/Protocols'
import { joinWithConditions, QueryUtil } from '@/Shared/Utils'
import { getConditions } from '@/Shared/Utils/traceabilityTable/getConditions'
import { getListRowsQuery } from '@/Shared/Utils/traceabilityTable/getListRowsQuery'
import {
  fetchListWithoutPagination,
  fetchListWithLimit
} from '@/Shared/Utils/traceabilityTable/fetchList'
import { FiltersPayload } from '../ProductiveChainFilter/productiveChainFilter.service'
import { QUERY_COLLECTION_TOTALIZERS } from './traceabilityTotalizers.query'
import { cityInfo } from '@/Shared/Services/ibgeCode.service'

export type traceabilityTotalizersQuery = FiltersPayload

const columns = {
  supplier: 'supplierName',
  outsource: 'outsourceName',
  weaving: 'name',
  wiring: 'name'
}

const NON_EXACT_KEYS = []

export class Repository {
  private $client: PGDB

  private $query: QueryUtil

  constructor({ $PGDB = PGDB, $Query = QueryUtil } = {}) {
    this.$client = new $PGDB()

    this.$query = new $Query(NON_EXACT_KEYS)
  }

  public async findTotalizers(
    { page, direction },
    filters: traceabilityTotalizersQuery = {}
  ) {
    const data = {
      Supplier: [],
      SubProviders: [],
      Weaving: [],
      Wiring: []
    }

    const [providers] = await Promise.all([
      await this.findProviders(
        { limit: 10, page, column: 'supplier', direction },
        filters
      )
    ])
    data.Supplier = providers.providers.map((provider) => {
      return provider
    })

    const [subProviders] = await Promise.all([
      await this.findSubProvider(
        { limit: 10, page, column: 'outsource', direction },
        filters
      )
    ])
    data.SubProviders = subProviders.subProviders.map((subprovider) => {
      return subprovider
    })

    const [wirings] = await Promise.all([
      await this.findWiring(
        { limit: 10, page, column: 'wiring', direction },
        filters
      )
    ])
    data.Wiring = wirings.wirings.map((wiring) => {
      return wiring
    })

    const [weavings] = await Promise.all([
      await this.findWeaving(
        { limit: 10, page, column: 'weaving', direction },
        filters
      )
    ])
    data.Weaving = weavings.weavings.map((weaving) => {
      return weaving
    })

    console.log(await cityInfo('3548500'))

    const found = {
      data
    }

    return found
  }

  public async findProviders(
    { limit, page, column, direction },
    filters: traceabilityTotalizersQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'supplier'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_TOTALIZERS,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_TOTALIZERS,
      target
    })

    const [providers] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      providers
    }

    return found
  }

  public async findSubProvider(
    { limit, page, column, direction },
    filters: traceabilityTotalizersQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'subProviders'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_TOTALIZERS,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_TOTALIZERS,
      target
    })

    const [subProviders] = await Promise.all([
      fetchListWithLimit(db, params, listRowsQuery)
    ])

    const found = {
      subProviders
    }

    return found
  }

  public async findWiring(
    { limit, page, column, direction },
    filters: traceabilityTotalizersQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'WiringRanking'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_TOTALIZERS,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_TOTALIZERS,
      target
    })

    const [wirings] = await Promise.all([
      fetchListWithLimit(db, params, listRowsQuery)
    ])

    const found = {
      wirings
    }

    return found
  }

  public async findWeaving(
    { limit, page, column, direction },
    filters: traceabilityTotalizersQuery = {}
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
        queryCollection: QUERY_COLLECTION_TOTALIZERS,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_TOTALIZERS,
      target
    })

    const [weavings] = await Promise.all([
      fetchListWithLimit(db, params, listRowsQuery)
    ])

    const found = {
      weavings
    }

    return found
  }
}
