import { omit, pick } from 'lodash'
import { Producer } from '@/Domain/Producer/producer.entity'
import { PropertyProducer } from '@/Domain/PropertyProducers/propertyProducers.entity'

import { Property as Entity } from './property.entity'
export class View {
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

      const location = {
        cityId: item.cityId,
        latitude: item.lat,
        longitude: item.lng,
        biomeId: item.biomeId
      }

      const projection = pick(item, 'id', 'blockStatus', 'name', 'CAR')
      return { ...projection, producers, location }
    }
    const data = items.map(project)

    return {
      items: data,
      pagination: { ...formattedPagination }
    }
  }

  transformOne(item: Entity): Record<string, any> {
    const omittedKeys = [
      'area',
      'createdAt',
      'updatedAt',
      'cityId',
      'password',
      'propertyLogs'
    ]

    function project(item) {
      if (item.city) {
        const city = item.city
        item.city = city.id
        item.state = city.uf
        item.latitude = city.latitude
      }
      const producers: any[] = []
      item.producers.forEach(
        (producer: Producer & { blockStatus: boolean; reason: string }) => {
          if (producer.id) {
            const prod = {
              id: producer.id,
              CPFCNPJ: producer.CPFCNPJ,
              name: producer.name,
              IE: producer.IE === 'ISENTO' ? '' : producer.IE,
              free: producer.IE === 'ISENTO',
              blockStatus: producer.blockStatus,
              reason: producer.reason
            }
            producers.push({
              ...prod
            })
          }
        }
      )

      const location = {
        cityId: item.cityId,
        latitude: item.lat,
        longitude: item.lng,
        biomeId: item.biomeId
      }

      const items = omit(item, ...omittedKeys)
      return { ...items, producers, location }
    }

    return project(item)
  }

  transformMany(items: Entity[]): Record<string, any>[] {
    return items.map((e) => this.transformOne(e))
  }
}
