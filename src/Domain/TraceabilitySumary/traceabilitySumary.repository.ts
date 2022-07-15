import { PGDB, B2B } from '@/Shared/Database/knex'
import { joinWithConditions, QueryUtil } from '@/Shared/Utils'
import { getConditions } from '@/Shared/Utils/traceabilityTable/getConditions'
import { getListRowsQuery } from '@/Shared/Utils/traceabilityTable/getListRowsQuery'
import { fetchListWithoutPagination } from '@/Shared/Utils/traceabilityTable/fetchList'
import { FiltersPayload } from '@/Domain/TraceabilityFilter/traceabilityFilter.service'
import { QUERY_COLLECTION_SUMARY } from './traceabilitySumary.query'

import { Repository as _Repository } from 'typeorm'

export type traceabilitySumaryQuery = FiltersPayload

const columns = {
  Sumary: 'totalOrders'
}

const NON_EXACT_KEYS = []

export class Repository {
  private $client: PGDB
  private $data: B2B

  private $query: QueryUtil

  constructor({
    $PGDB = PGDB,

    $Query = QueryUtil
  } = {}) {
    this.$client = new $PGDB()
    this.$data = new B2B()
    this.$query = new $Query(NON_EXACT_KEYS)
  }

  public async findTraceabilitySumary(
    { limit, page, direction },
    filters: traceabilitySumaryQuery = {}
  ) {
    const [Sumary] = await Promise.all([
      await this.findSumary(
        { limit, page, column: 'Sumary', direction },
        filters
      )
    ])
    const data = Sumary.Sumary.map((Sumary) => {
      return Sumary
    })

    return data
  }

  public async findSumary(
    { limit, page, column, direction },
    filters: traceabilitySumaryQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'sumary'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_SUMARY,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_SUMARY,
      target
    })

    const [Sumary] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      Sumary
    }

    return found
  }
}
