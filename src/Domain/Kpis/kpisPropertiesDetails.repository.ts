import { Repository as _Repository } from 'typeorm'
import { joinWithConditions } from '@/Shared/Utils'
import { getConditions } from '@/Shared/Utils/traceabilityTable/getConditions'
import { getListRowsQuery } from '@/Shared/Utils/traceabilityTable/getListRowsQuery'
import { fetchList } from '@/Shared/Utils/traceabilityTable/fetchList'
import { countList } from '@/Shared/Utils/traceabilityTable/countList'
import { QUERY_COLLECTION } from '@/Shared/Utils/traceabilityTable/propertiesDetails.query'

import { PGDB } from '@/Shared/Database/knex'
import { Accesses } from '@/Shared/Protocols'
import { FiltersPayload } from '../TraceabilityFilter/traceabilityFilter.service'
import { PropertieDetails } from './propertieDetails.class'

export type PropertiesDetailsQuery = FiltersPayload

const columns = {
  cargo: 'nr_carga',
  destinationcity: 'nf_destino_cidade',
  destinationcnpj: 'nf_cnpj_destino',
  destinationname: 'nf_destino_nome_razosocial',
  destinationstate: 'nf_destino_estado',
  driver: 'motorista',
  hashpartner: 'hash_partner',
  invoice: 'nf_numero',
  invoicedate: 'dt_emissao_nf',
  invoicetype: 'nf_natureza',
  shipmentdate: 'dt_expedicao',
  order: 'faz_car',
  orderdate: 'dt_venda',
  qtt: 'quantidade',
  shippingcnpj: 'cnpj_transportadora',
  shippingcompany: 'nome_transportadora',
  stockcnpj: 'cnpj_local_estoque',
  status: 'rastreavel',
  truckplate: 'placa_caminhao'
}

export class Repository {
  private $client: PGDB

  constructor() {
    this.$client = new PGDB()
  }

  public async findPropertiesDetails(
    { limit, page, column, direction },
    filters: PropertiesDetailsQuery = {},
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

    const target = 'propertiesDetailsKpi'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION,
        target
      }),
      QUERY_COLLECTION.propertiesDetailsKpi.accessesFilter(accesses)
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

    const WRAPPERS = { propertiesDetailsKpi: PropertieDetails }

    const [items, totalItems = 1000] = await Promise.all([
      fetchList(db, params, listRowsQuery, WRAPPERS[target]),
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
}
