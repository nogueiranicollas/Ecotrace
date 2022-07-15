import { Repository as _Repository } from 'typeorm'

import { PGDB } from '@/Shared/Database/knex'
import { Accesses } from '@/Shared/Protocols'
import { joinWithConditions } from '@/Shared/Utils'
import { getConditions } from '@/Shared/Utils/traceabilityTable/getConditions'
import { getListRowsQuery } from '@/Shared/Utils/traceabilityTable/getListRowsQuery'
import { fetchList } from '@/Shared/Utils/traceabilityTable/fetchList'
import { countList } from '@/Shared/Utils/traceabilityTable/countList'
import { fetchChartDelayed } from '@/Shared/Utils/orderCharts/fetchChartDelayed'
import { fetchChartOrigin } from '@/Shared/Utils/orderCharts/fetchChartOrigin'
import { fetchChartDeliveredOpen } from '@/Shared/Utils/orderCharts/fetchChartDeliveredOpen'
import { fetchChartSupplier } from '@/Shared/Utils/orderCharts/fetchChartSupplier'
import { FiltersPayload } from '../TraceabilityFilter/traceabilityFilter.service'
import { QUERY_COLLECTION } from './order.query'
import { Order } from './order.class'
import { fetchOrderKpis } from '@/Shared/Utils/traceabilityTable/fetchOrderKpis'

export type OrderQuery = FiltersPayload

const columns = {
  ordernumber: 'id',
  rmsorder: 'rms_pedido',
  qtytotal: 'qty_total',
  scheduleyear: 'schedule_year',
  scheduleweek: 'schedule_week',
  scheduleinitialdate: 'schedule_initial_date',
  schedulefinaldate: 'schedule_final_date',
  orderorigin: 'origem_pedido',
  ordertype: 'order_type',
  potype: 'po_type',
  pofast: 'po_fast',
  usecode: 'use_code',
  status: 'status',
  dtcreate: 'data_registro_pedido',
  dtupdated: 'dt_updated',
  supplierid: 'fornecedor_id',
  deletedat: 'deleted_at',
  createdat: 'created_at',
  updatedat: 'updated_at',
  blockchainhash: 'blockchain_hash',
  suppliername: 'name',
  suppliercnpj: 'cnpj'
}

export class Repository {
  private $client: PGDB

  constructor() {
    this.$client = new PGDB()
  }

  public async find(
    { limit, page, column, direction },
    filters: OrderQuery = {},
    accesses?: Accesses
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns.ordernumber,
      direction
    }

    const _params = {
      ...filters,
      limit,
      page,
      column: 'p.id',
      direction
    }
    const db = this.$client.knex

    const target = 'orders'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION,
        target
      }),
      QUERY_COLLECTION.orders.accessesFilter(accesses)
    )
    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION,
      target
    })
    const countRowsQuery = getListRowsQuery({
      conditions,
      count: true,
      queryCollection: QUERY_COLLECTION,
      target
    })

    const WRAPPERS = { orders: Order }

    const [items, totalItems = 1000] = await Promise.all([
      fetchList(db, _params, listRowsQuery, WRAPPERS[target]),
      countList(db, countRowsQuery)
    ])

    const totalPages =
      totalItems <= limit ? 1 : parseInt((totalItems / limit).toFixed())

    const found = {
      items,
      pagination: {
        totalPages,
        totalItems: totalItems,
        page,
        limit
      }
    }

    return found
  }

  public async getOrderChartDelayedByMonth(
    { limit, page, column, direction },
    filters: OrderQuery = {},
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

    const target = 'orders'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION,
        target
      }),
      QUERY_COLLECTION.orders.accessesFilter(accesses)
    )

    const countRowsQuery = getListRowsQuery({
      conditions,
      count: true,
      queryCollection: QUERY_COLLECTION,
      target
    })

    const [totalItems = 1000] = await Promise.all([
      countList(db, countRowsQuery)
    ])

    const totalPages =
      totalItems <= limit ? 1 : parseInt((totalItems / limit).toFixed())

    const charts = await fetchChartDelayed({ db, params, accesses })

    const found = {
      charts: charts,
      pagination: {
        totalPages,
        totalItems: totalItems,
        page,
        limit
      }
    }

    return found
  }

  public async getOrderChartBySupplier(
    { limit, page, column, direction },
    filters: OrderQuery = {},
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

    const target = 'orders'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION,
        target
      }),
      QUERY_COLLECTION.orders.accessesFilter(accesses)
    )

    const countRowsQuery = getListRowsQuery({
      conditions,
      count: true,
      queryCollection: QUERY_COLLECTION,
      target
    })

    const [totalItems = 1000] = await Promise.all([
      countList(db, countRowsQuery)
    ])

    const totalPages =
      totalItems <= limit ? 1 : parseInt((totalItems / limit).toFixed())

    const charts = await fetchChartSupplier({ db, params, accesses })

    const found = {
      charts: charts,
      pagination: {
        totalPages,
        totalItems: totalItems,
        page,
        limit
      }
    }

    return found
  }

  public async getOrderChartDeliveredOpenByMonth(
    { limit, page, column, direction },
    filters: OrderQuery = {},
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

    const target = 'orders'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION,
        target
      }),
      QUERY_COLLECTION.orders.accessesFilter(accesses)
    )

    const countRowsQuery = getListRowsQuery({
      conditions,
      count: true,
      queryCollection: QUERY_COLLECTION,
      target
    })

    const [totalItems = 1000] = await Promise.all([
      countList(db, countRowsQuery)
    ])

    const totalPages =
      totalItems <= limit ? 1 : parseInt((totalItems / limit).toFixed())

    const charts = await fetchChartDeliveredOpen({ db, params, accesses })

    const found = {
      charts: charts,
      pagination: {
        totalPages,
        totalItems: totalItems,
        page,
        limit
      }
    }

    return found
  }

  public async getOrderChartByOrigin(
    { limit, page, column, direction },
    filters: OrderQuery = {},
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

    const target = 'orders'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION,
        target
      }),
      QUERY_COLLECTION.orders.accessesFilter(accesses)
    )

    const countRowsQuery = getListRowsQuery({
      conditions,
      count: true,
      queryCollection: QUERY_COLLECTION,
      target
    })

    const [totalItems = 1000] = await Promise.all([
      countList(db, countRowsQuery)
    ])

    const totalPages =
      totalItems <= limit ? 1 : parseInt((totalItems / limit).toFixed())

    const charts = await fetchChartOrigin({ db, params, accesses })

    const found = {
      charts: charts,
      pagination: {
        totalPages,
        totalItems: totalItems,
        page,
        limit
      }
    }

    return found
  }

  public async getOrderCards(
    { limit, page, column, direction },
    filters: OrderQuery = {},
    accesses?: Accesses
  ) {
    const params = { ...filters }

    Object.assign(params, {
      ...filters
      // limit,
      // page,
      // column: ORDERS_KPI_COLUMNS[column],
      // direction
    })

    const db = this.$client.knex

    return fetchOrderKpis({ db, params, accesses })
  }
}
