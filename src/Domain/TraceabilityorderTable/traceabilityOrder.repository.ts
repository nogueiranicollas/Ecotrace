import { PGDB } from '@/Shared/Database/knex'
import { joinWithConditions, QueryUtil } from '@/Shared/Utils'
import { getConditions } from '@/Shared/Utils/traceabilityTable/getConditions'
import { getListRowsQuery } from '@/Shared/Utils/traceabilityTable/getListRowsQuery'
import { fetchListWithoutPagination } from '@/Shared/Utils/traceabilityTable/fetchList'
import { FiltersPayload } from '../ProductiveChainFilter/productiveChainFilter.service'
import { QUERY_COLLECTION_ORDERS } from './traceabilityOrder.query'

import { Repository as _Repository } from 'typeorm'

export type traceabilityTotalizersQuery = FiltersPayload

const columns = {
  allOrders: 'orderNumber',
  oneOrder: 'orderNumber',
  itens: 'invoiceNumber',
  wiring: 'name'
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

  public async findTraceabilityOrder(
    { limit, page, direction },
    filters: traceabilityTotalizersQuery = {}
  ) {
    const data = {
      AllOrders: [],
      SpecificOrder: [],
      details: []
    }

    const [AllOrders] = await Promise.all([
      await this.findOrders(
        { limit, page, column: 'allOrders', direction },
        filters
      )
    ])
    data.AllOrders = AllOrders.AllOrders.map((AllOrder) => {
      return AllOrder
    })

    const [OneOrders] = await Promise.all([
      await this.findOneOrder(
        { limit, page, column: 'oneOrder', direction },
        filters
      )
    ])
    data.SpecificOrder = OneOrders.OneOrders.map((OneOrder) => {
      return OneOrder
    })

    const [details] = await Promise.all([
      await this.findDetails(
        { limit, page, column: 'itens', direction },
        filters
      )
    ])
    data.details = details.details.map((detail) => {
      return detail
    })

    return data
  }

  public async findTraceabilityDetails(
    { limit, page, direction },
    filters: traceabilityTotalizersQuery = {}
  ) {
    const data = {
      SpecificOrder: [],
      details: []
    }

    const [OneOrders] = await Promise.all([
      await this.findOneOrder(
        { limit, page, column: 'oneOrder', direction },
        filters
      )
    ])
    data.SpecificOrder = OneOrders.OneOrders.map((OneOrder) => {
      return OneOrder
    })

    const [details] = await Promise.all([
      await this.findDetails(
        { limit, page, column: 'itens', direction },
        filters
      )
    ])
    data.details = details.details.map((detail) => {
      return detail
    })

    return data
  }

  public async findOrders(
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

    const target = 'Orders'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_ORDERS,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_ORDERS,
      target
    })

    const [AllOrders] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      AllOrders
    }

    return found
  }

  public async findOneOrder(
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

    const target = 'SpecificOrder'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_ORDERS,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_ORDERS,
      target
    })

    const [OneOrders] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      OneOrders
    }

    return found
  }

  public async findDetails(
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

    const target = 'details'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_ORDERS,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_ORDERS,
      target
    })

    const [details] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      details
    }

    return found
  }
}
