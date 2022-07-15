import { PGDB } from '@/Shared/Database/knex'

import { joinWithConditions, QueryUtil } from '@/Shared/Utils'
import { getConditions } from '@/Shared/Utils/traceabilityTable/getConditions'
import { getListRowsQuery } from '@/Shared/Utils/traceabilityTable/getListRowsQuery'
import { fetchListWithoutPagination } from '@/Shared/Utils/traceabilityTable/fetchList'
import { FiltersPayload } from '../ProductiveChainFilter/productiveChainFilter.service'
import { QUERY_COLLECTION_WEAVING } from './traceabilityWeaving.query'

import { Repository as _Repository } from 'typeorm'

export type traceabilityWeavingQuery = FiltersPayload

const columns = {
  Weaving: 'orderNumber',
  Details: 'orderNumber',
  OrigenLine: 'supplierCNPJ',
  Production: 'barcodes',
  Chemical: 'ncm',
  Composition: 'ncm'
}

const NON_EXACT_KEYS = []

export class Repository {
  private $client: PGDB
  private $query: QueryUtil

  constructor({ $PGDB = PGDB, $Query = QueryUtil } = {}) {
    this.$client = new $PGDB()
    this.$query = new $Query(NON_EXACT_KEYS)
  }

  public async findTraceabilityWeaving(
    { limit, page, direction },
    filters: traceabilityWeavingQuery = {}
  ) {
    const data = {
      Weaving: [],
      Details: [],
      OrigenLine: [],
      Production: [],
      Chemical: [],
      Composition: []
    }

    const [Weaving] = await Promise.all([
      await this.findWeaving(
        { limit, page, column: 'Weaving', direction },
        filters
      )
    ])
    data.Weaving = Weaving.Weaving.map((Weaving) => {
      return Weaving
    })

    const [Details] = await Promise.all([
      await this.findDetails(
        { limit, page, column: 'Details', direction },
        filters
      )
    ])
    data.Details = Details.Details.map((Details) => {
      return Details
    })

    const [OrigenLine] = await Promise.all([
      await this.findOrigenLine(
        { limit, page, column: 'OrigenLine', direction },
        filters
      )
    ])
    data.OrigenLine = OrigenLine.OrigenLine.map((OrigenLine) => {
      return OrigenLine
    })

    const [Production] = await Promise.all([
      await this.findProduction(
        { limit, page, column: 'Production', direction },
        filters
      )
    ])
    data.Production = Production.Production.map((Production) => {
      return Production
    })

    const [Chemical] = await Promise.all([
      await this.findChemical(
        { limit, page, column: 'Chemical', direction },
        filters
      )
    ])
    data.Chemical = Chemical.Chemicals.map((Chemical) => {
      return Chemical
    })

    const [Composition] = await Promise.all([
      await this.findComposition(
        { limit, page, column: 'Composition', direction },
        filters
      )
    ])
    data.Composition = Composition.Composition.map((Composition) => {
      return Composition
    })

    return data
  }

  public async findWeaving(
    { limit, page, column, direction },
    filters: traceabilityWeavingQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'Weaving'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_WEAVING,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_WEAVING,
      target
    })

    const [Weaving] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      Weaving
    }

    return found
  }

  public async findDetails(
    { limit, page, column, direction },
    filters: traceabilityWeavingQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'Details'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_WEAVING,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_WEAVING,
      target
    })

    const [Details] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      Details
    }

    return found
  }

  public async findOrigenLine(
    { limit, page, column, direction },
    filters: traceabilityWeavingQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'OrigenLine'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_WEAVING,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_WEAVING,
      target
    })

    const [OrigenLine] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      OrigenLine
    }

    return found
  }

  public async findProduction(
    { limit, page, column, direction },
    filters: traceabilityWeavingQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'Production'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_WEAVING,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_WEAVING,
      target
    })

    const [Production] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      Production
    }

    return found
  }

  public async findChemical(
    { limit, page, column, direction },
    filters: traceabilityWeavingQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'Chemical'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_WEAVING,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_WEAVING,
      target
    })

    const [Chemicals] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      Chemicals
    }

    return found
  }

  public async findComposition(
    { limit, page, column, direction },
    filters: traceabilityWeavingQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'Composition'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_WEAVING,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_WEAVING,
      target
    })

    const [Composition] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      Composition
    }

    return found
  }
}
