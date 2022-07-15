import { PGDB } from '@/Shared/Database/knex'
import {} from '@/Shared/Protocols'
import { joinWithConditions, QueryUtil } from '@/Shared/Utils'
import { getConditions } from '@/Shared/Utils/traceabilityTable/getConditions'
import { getListRowsQuery } from '@/Shared/Utils/traceabilityTable/getListRowsQuery'
import { fetchListWithoutPagination } from '@/Shared/Utils/traceabilityTable/fetchList'
import { FiltersPayload } from '../ProductiveChainFilter/productiveChainFilter.service'
import { QUERY_COLLECTION_WEAVING } from './traceabilityWiring.query'

export type traceabilityWiringQuery = FiltersPayload

const columns = {
  Wiring: 'orderNumber',
  Details: 'orderNumber',
  Crop: 'crop',
  Production: 'barcode',
  Chemical: 'ncm',
  Composition: 'ncm'
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

  public async findTraceabilityWiring(
    { limit, page, direction },
    filters: traceabilityWiringQuery = {}
  ) {
    const data = {
      Wiring: [],
      Details: [],
      Crop: [],
      Production: [],
      Chemical: [],
      Composition: []
    }

    const [Wiring] = await Promise.all([
      await this.findWiring(
        { limit, page, column: 'Wiring', direction },
        filters
      )
    ])
    data.Wiring = Wiring.Wiring.map((Wiring) => {
      return Wiring
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

    const [Crop] = await Promise.all([
      await this.findCrop({ limit, page, column: 'Crop', direction }, filters)
    ])
    data.Crop = Crop.Crop.map((Crop) => {
      return Crop
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

  public async findWiring(
    { limit, page, column, direction },
    filters: traceabilityWiringQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'Wiring'
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

    const [Wiring] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      Wiring
    }

    return found
  }

  public async findDetails(
    { limit, page, column, direction },
    filters: traceabilityWiringQuery = {}
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

  public async findCrop(
    { limit, page, column, direction },
    filters: traceabilityWiringQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'Crop'
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

    const [Crop] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      Crop
    }

    return found
  }

  public async findProduction(
    { limit, page, column, direction },
    filters: traceabilityWiringQuery = {}
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
    filters: traceabilityWiringQuery = {}
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
    filters: traceabilityWiringQuery = {}
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
