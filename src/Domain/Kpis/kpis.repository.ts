import { Repository as _Repository } from 'typeorm'

import { PGDB } from '@/Shared/Database/knex'
import { Accesses } from '@/Shared/Protocols'
import { fetchKpis } from '@/Shared/Utils/traceabilityTable/fetchKpis'
import { FiltersPayload } from '../TraceabilityFilter/traceabilityFilter.service'

export type OrderQuery = FiltersPayload

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
  order: 'id',
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

  public async find(
    { limit, page, column, direction },
    filters: OrderQuery = {},
    accesses?: Accesses
  ) {
    const params = filters

    Object.assign(params, {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    })

    const db = this.$client.knex

    return fetchKpis({ db, params, accesses })
  }
}
