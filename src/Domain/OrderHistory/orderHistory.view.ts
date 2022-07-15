import { Formatter, Generator } from '@/Shared/Utils'

type OrderHistory = Record<string, any>
type OrderHistoryView = Record<string, any>

export class View {
  transformOne(item: OrderHistory): OrderHistoryView {
    if ('id' in Object.keys(item)) {
      Object.assign(item, { id: Generator.alpha(8) })
    }

    return {
      assetType: item['@assetType'],
      key: item['@key'],
      lastTouchBy: item['@lastTouchBy'],
      timestamp: Formatter.date(item._timestamp),
      author: item.author,
      charge: item.carga,
      cnpjLocalStock: Formatter.CNPJ(item.cnpj_local_estoque),
      dateDispatch: Formatter.date(item.dt_expedicao),
      dateSale: Formatter.date(item.dt_venda),
      hashPartner: item.hash_partner,
      order: item.id,
      payload: item.payload,
      originalData: {
        '@assetType': item['@assetType'],
        '@key': item['@key'],
        '@lastTouchBy': item['@lastTouchBy'],
        _timestamp: Formatter.date(item._timestamp),
        author: item.author,
        carga: item.carga,
        cnpj_local_estoque: item.cnpj_local_estoque,
        dt_expedicao: item.dt_expedicao,
        dt_venda: item.dt_venda,
        hash_partner: item.hash_partner,
        nr_pedido: item.id
      }
    }
  }

  transformMany(item: Record<string, any>): OrderHistoryView {
    const { data } = item

    return [...data.map(this.transformOne)]
  }
}
