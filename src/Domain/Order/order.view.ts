import { Formatter } from '@/Shared/Utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { fromPairs } from 'lodash'

type Order = Record<string, any>
type OrderView = Record<string, any>

export class View {
  transformOne(item: Order): OrderView {
    const base = fromPairs(
      Object.keys(item).map((key) => {
        if (item[key] === null) return [key, '-']
        return [key, item[key]]
      })
    )

    return {
      ...base,
      destinationcnpj: Formatter.CPFCNPJ(item.destinationcnpj),
      // shipmentdate: format(item.shipmentdate, 'dd/MM/yyyy', { locale: ptBR }),
      // orderdate: format(item.orderdate, 'dd/MM/yyyy', { locale: ptBR }),
      // invoicedate: item.invoicedate
       // ? format(item.invoicedate, 'dd/MM/yyyy', { locale: ptBR })
        // : '',
      //qtt: Formatter.int(item.qtt),
      // shippingcnpj: Formatter.CPFCNPJ(item.shippingcnpj),
      //stockcnpj: Formatter.CPFCNPJ(item.stockcnpj)
    }
  }

  transformMany(item: Record<string, any>): OrderView {
    const { charts, items, kpis, pagination } = item

    const { limit, page, totalItems, totalPages } = pagination
    const formatedPagination = {
      limit,
      page,
      totalItems,
      totalPages
    }

    return {
      charts,
      items: items.map(this.transformOne),
      kpis,
      pagination: { ...formatedPagination }
    }
  }
}
