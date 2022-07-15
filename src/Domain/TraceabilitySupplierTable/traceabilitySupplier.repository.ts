import { PGDB } from '@/Shared/Database/knex'

import { joinWithConditions, QueryUtil } from '@/Shared/Utils'
import { getConditions } from '@/Shared/Utils/traceabilityTable/getConditions'
import { getListRowsQuery } from '@/Shared/Utils/traceabilityTable/getListRowsQuery'
import { fetchListWithoutPagination } from '@/Shared/Utils/traceabilityTable/fetchList'
import { FiltersPayload } from '../ProductiveChainFilter/productiveChainFilter.service'
import { QUERY_COLLECTION_SUPPLIER } from './traceabilitySupplier.query'
import { Repository as _Repository } from 'typeorm'

export type traceabilitySupplierQuery = FiltersPayload

const columns = {
  Supplier: 'orderNumber',
  SpecificProvider: 'orderNumber',
  Production: 'itemCode',
  Outsource: 'outsourcesCNPJ',
  Tissue: 'confectionCnpj',
  Chemical: 'ncm'
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

  public async findTraceabilitySupplier(
    { limit, page, direction },
    filters: traceabilitySupplierQuery = {}
  ) {
    const data = {
      Suppliers: [],
      SpecificOrder: [],
      Production: [],
      Outsources: [],
      Tissues: [],
      Chemical: []
    }

    const [Suppliers] = await Promise.all([
      await this.findSuppliers(
        { limit, page, column: 'Supplier', direction },
        filters
      )
    ])
    data.Suppliers = Suppliers.Suppliers.map((Supplier) => {
      return Supplier
    })

    const [SpecificProviders] = await Promise.all([
      await this.findSpecificProvider(
        { limit, page, column: 'SpecificProvider', direction },
        filters
      )
    ])
    data.SpecificOrder = SpecificProviders.SpecificProvider.map(
      (SpecificProvider) => {
        return SpecificProvider
      }
    )

    const [Productions] = await Promise.all([
      await this.findProduction(
        { limit, page, column: 'Production', direction },
        filters
      )
    ])
    data.Production = Productions.Productions.map((Production) => {
      return Production
    })

    const [Outsources] = await Promise.all([
      await this.findOutsources(
        { limit, page, column: 'Outsource', direction },
        filters
      )
    ])
    data.Outsources = Outsources.Outsources.map((Outsource) => {
      return Outsource
    })

    const [Tissues] = await Promise.all([
      await this.findTissues(
        { limit, page, column: 'Tissue', direction },
        filters
      )
    ])
    data.Tissues = Tissues.Tissues.map((Tissue) => {
      return Tissue
    })

    const [Chemicals] = await Promise.all([
      await this.findChemical(
        { limit, page, column: 'Chemical', direction },
        filters
      )
    ])
    data.Chemical = Chemicals.Chemicals.map((Chemical) => {
      return Chemical
    })

    return data
  }

  public async findSuppliers(
    { limit, page, column, direction },
    filters: traceabilitySupplierQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'Providers'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_SUPPLIER,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_SUPPLIER,
      target
    })

    const [Suppliers] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      Suppliers
    }

    return found
  }

  public async findSpecificProvider(
    { limit, page, column, direction },
    filters: traceabilitySupplierQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'SpecificProvider'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_SUPPLIER,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_SUPPLIER,
      target
    })

    const [SpecificProvider] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      SpecificProvider
    }

    return found
  }

  public async findProduction(
    { limit, page, column, direction },
    filters: traceabilitySupplierQuery = {}
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
        queryCollection: QUERY_COLLECTION_SUPPLIER,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_SUPPLIER,
      target
    })

    const [Productions] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      Productions
    }

    return found
  }

  public async findOutsources(
    { limit, page, column, direction },
    filters: traceabilitySupplierQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'Outsources'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_SUPPLIER,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_SUPPLIER,
      target
    })

    const [Outsources] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      Outsources
    }

    return found
  }

  public async findTissues(
    { limit, page, column, direction },
    filters: traceabilitySupplierQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'Tissue'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_SUPPLIER,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_SUPPLIER,
      target
    })

    const [Tissues] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      Tissues
    }

    return found
  }

  public async findChemical(
    { limit, page, column, direction },
    filters: traceabilitySupplierQuery = {}
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
        queryCollection: QUERY_COLLECTION_SUPPLIER,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_SUPPLIER,
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
}
