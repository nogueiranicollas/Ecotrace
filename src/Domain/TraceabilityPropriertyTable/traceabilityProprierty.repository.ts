import { PGDB, B2B } from '@/Shared/Database/knex'

import { joinWithConditions, QueryUtil } from '@/Shared/Utils'
import { getConditions } from '@/Shared/Utils/traceabilityTable/getConditions'
import { getListRowsQuery } from '@/Shared/Utils/traceabilityTable/getListRowsQuery'
import { fetchListWithoutPagination } from '@/Shared/Utils/traceabilityTable/fetchList'
import { FiltersPayload } from '@/Domain/TraceabilityFilter/traceabilityFilter.service'
import { QUERY_COLLECTION_PROPRIERTY } from './traceabilityProprierty.query'

import { Repository as _Repository } from 'typeorm'

export type traceabilityPropriertyQuery = FiltersPayload

const columns = {
  proprierty: 'orderNumber',
  certifications: 'certification'
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

  public async findTraceabilityProprierty(
    { limit, page, direction },
    filters: traceabilityPropriertyQuery = {}
  ) {
    const data = {
      proprierty: [],
      certifications: []
    }

    const [proprierty] = await Promise.all([
      await this.findProprierty(
        { limit, page, column: 'proprierty', direction },
        filters
      )
    ])
    data.proprierty = proprierty.proprierty.map((proprierty) => {
      return proprierty
    })

    const [certifications] = await Promise.all([
      await this.findCertifications(
        { limit, page, column: 'certifications', direction },
        filters
      )
    ])
    data.certifications = certifications.certifications.map(
      (certifications) => {
        return certifications
      }
    )

    return data
  }

  public async findProprierty(
    { limit, page, column, direction },
    filters: traceabilityPropriertyQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'proprierty'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_PROPRIERTY,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_PROPRIERTY,
      target
    })

    const [proprierty] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      proprierty
    }

    return found
  }

  public async findCertifications(
    { limit, page, column, direction },
    filters: traceabilityPropriertyQuery = {}
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$data.knex

    const target = 'certifications'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION_PROPRIERTY,
        target
      }),
      ''
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION_PROPRIERTY,
      target
    })

    const [certifications] = await Promise.all([
      fetchListWithoutPagination(db, params, listRowsQuery)
    ])

    const found = {
      certifications
    }

    return found
  }
}
