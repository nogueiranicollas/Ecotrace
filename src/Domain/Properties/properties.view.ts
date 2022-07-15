import { Formatter, Generator } from '@/Shared/Utils'
import { pick } from 'lodash'
import { PropertyProducer } from '../PropertyProducers/propertyProducers.entity'

type Properties = Record<string, any>
type PropertiesView = Record<string, any>

export class View {
  transformOne(item: Properties): PropertiesView {
    if ('id' in Object.keys(item)) {
      Object.assign(item, { id: Generator.alpha(8) })
    }

    return {
      ...item,
      slaughterindustrycnpj: Formatter.CPFCNPJ(item.slaughterindustrycnpj),
      boughtat: Formatter.date(item.boughtat),
      slaughtedat: Formatter.date(item.slaughtedat),
      producerdoc: Formatter.CPFCNPJ(item.producerdoc),
      proplat: Formatter.geoPoint(item.proplat),
      proplng: Formatter.geoPoint(item.proplng)
    }
  }

  transformMany(item: Record<string, any>): PropertiesView {
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

  transformToList(item: Record<string, any>) {
    const { items, pagination } = item

    const { limit, page, totalItems, totalPages } = pagination
    const formattedPagination = {
      limit,
      page,
      totalItems,
      totalPages
    }

    function project(item) {
      const producers: any[] = []
      item.producers.forEach((propertyProducer: PropertyProducer) => {
        if (propertyProducer.id) {
          const prod = {
            CPFCNPJ: propertyProducer.producer.CPFCNPJ,
            name: propertyProducer.producer.name,
            IE: propertyProducer.producer.IE,
            blockStatus: propertyProducer.blockStatus,
            reason: propertyProducer.reason
          }
          producers.push({ ...prod })
        }
      })

      const states = item.city.uf

      const projection = pick(item, 'id', 'blockStatus', 'name', 'CAR')
      return { ...projection, producers, states }
    }
    const data = items.map(project)

    return {
      items: data,
      pagination: { ...formattedPagination }
    }
  }
}
