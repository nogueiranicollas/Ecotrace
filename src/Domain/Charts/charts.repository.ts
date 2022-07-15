import { PGDB } from '@/Shared/Database/knex'
import { joinWithConditions, QueryUtil } from '@/Shared/Utils'
import { getConditions } from '@/Shared/Utils/traceabilityTable/getConditions'
import { getListRowsQuery } from '@/Shared/Utils/traceabilityTable/getListRowsQuery'
import {
  fetchListWithoutPagination,
  fetchListTeste,
  fetchListWithLimit
} from '@/Shared/Utils/traceabilityTable/fetchList'
import { FiltersPayload } from '../ProductiveChainFilter/productiveChainFilter.service'
import { QUERY_COLLECTION_CHARTS } from './charts.query'

import { Repository as _Repository } from 'typeorm'

export type ChartsQuery = FiltersPayload

const columns = {
  order: 'orders'
}

const NON_EXACT_KEYS = []

export class Repository {
  private $client: PGDB

  private $query: QueryUtil

  constructor({
    $PGDB = PGDB,

    $Query = QueryUtil
  } = {}) {
    this.$client = new $PGDB()

    this.$query = new $Query(NON_EXACT_KEYS)
  }

  public async findProductiveChain(
    { page, direction },
    filters: ChartsQuery = {}
  ) {
    const data = {
      supplyersRanking: [],
      providerRanking: [],
      weavingRanking: [],
      wiringRanking: []
    }

    const [supplyes] = await Promise.all([
      await this.findsupplyersRanking(
        { limit: 10, page, column: 'order', direction: 'desc' },
        filters
      )
    ])
    data.supplyersRanking = supplyes.supplyes.map((supplye) => {
      return supplye
    })

    const [providers] = await Promise.all([
      await this.findProviderRanking(
        { limit: 10, page, column: 'order', direction: 'desc' },
        filters
      )
    ])
    data.providerRanking = providers.providers.map((provider) => {
      return provider
    })

    const [wirings] = await Promise.all([
      await this.findWiringRanking(
        { limit: 10, page, column: 'order', direction },
        filters
      )
    ])
    data.wiringRanking = wirings.wirings.map((wiring) => {
      return wiring
    })

    const [weavings] = await Promise.all([
      await this.findWeaving(
        { limit: 10, page, column: 'order', direction: 'desc' },
        filters
      )
    ])
    data.weavingRanking = weavings.weavings.map((weaving) => {
      return weaving
    })

    return data
  }

  public async findsupplyersRanking(
    { limit, page, column, direction },
    filters: ChartsQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'supplyersRanking'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_CHARTS,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_CHARTS,
      target
    })

    const [supplyes] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      supplyes
    }

    return found
  }

  public async findOrderItens(
    { limit, page, column, direction },
    filters: ChartsQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'supplyersRanking'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_CHARTS,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_CHARTS,
      target
    })

    // if (!filters.locations) {
    const [orderItens] = await Promise.all([
      fetchListTeste(db, params, listRowsQuery)
    ])

    const found = {
      orderItens
    }

    return found
  }

  public async findProviderRanking(
    { limit, page, column, direction },
    filters: ChartsQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'ProviderRanking'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_CHARTS,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_CHARTS,
      target
    })

    const [providers] = await Promise.all([
      fetchListWithLimit(db, params, listRowsQuery)
    ])

    const found = {
      providers
    }

    return found
  }

  public async findWiringRanking(
    { limit, page, column, direction },
    filters: ChartsQuery = {}
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
        queryCollection: QUERY_COLLECTION_CHARTS,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_CHARTS,
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
    filters: ChartsQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'WeavingRanking'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_CHARTS,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_CHARTS,
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
