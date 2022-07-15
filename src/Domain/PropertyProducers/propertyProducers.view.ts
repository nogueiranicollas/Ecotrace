import { omit, pick } from 'lodash'
import { Producer } from '@/Domain/Producer/producer.entity'

import { PropertyProducer } from './propertyProducers.entity'
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
      const property = {
        propertyName: item.property.name,
        CAR: item.property.CAR,
        state: item.property.city.uf
      }

      const producer = {
        producerName: item.producer.name,
        CPFCNPJ: item.producer.CPFCNPJ,
        IE: item.producer.IE
      }

      const projection = pick(
        item,
        'blockStatus',
        'propertyId',
        'producerId',
        'reason'
      )
      return {
        ...projection,
        ...property,
        ...producer,
        id: item.id
      }
    }
    const data = items.map(project)

    return {
      items: data,
      pagination: { ...formattedPagination }
    }
  }

  transformToListNotPagination(item: Record<string, any>) {
    function project(item) {
      const property = {
        propertyName: item.property.name,
        CAR: item.property.CAR,
        state: item.property.city.uf
      }

      const producer = {
        producerName: item.producer.name,
        CPFCNPJ: item.producer.CPFCNPJ,
        IE: item.producer.IE
      }

      const projection = pick(
        item,
        'blockStatus',
        'propertyId',
        'producerId',
        'reason'
      )
      return {
        ...projection,
        ...property,
        ...producer,
        id: item.id
      }
    }
    const data = item.map(project)

    return {
      items: data
    }
  }

  transformOne(item: PropertyProducer): Record<string, any> {
    const omittedKeysProperty = ['area', 'createdAt', 'updatedAt', 'cityId']

    function project(item) {
      const data = {
        ...item.property,
        producers: [item.producer]
      }
      if (data.city) {
        const city = data.city
        data.city = city.id
        data.state = city.uf
      }
      const producers: any[] = []
      data.producers.forEach((producer: Producer) => {
        if (producer.id) {
          const prod = {
            id: producer.id,
            CPFCNPJ: producer.CPFCNPJ,
            name: producer.name,
            IE: producer.IE === 'ISENTO' ? '' : producer.IE,
            free: producer.IE === 'ISENTO',
            blockStatus: item.blockStatus,
            reason: item.reason
          }
          producers.push({ ...prod })
        }
      })

      const items = omit(data, ...omittedKeysProperty)
      return { ...items, producers }
    }

    return project(item)
  }

  transformMany(items: PropertyProducer[]): Record<string, any>[] {
    return items.map((e) => this.transformOne(e))
  }
}
