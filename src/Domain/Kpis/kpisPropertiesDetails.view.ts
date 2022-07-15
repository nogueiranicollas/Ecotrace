import { Generator } from '@/Shared/Utils'

type KpisPropertiesDetails = Record<string, any>
type KpisPropertiesDetailsView = Record<string, any>

export class View {
  transformOne(item: KpisPropertiesDetails): KpisPropertiesDetailsView {
    if ('id' in Object.keys(item)) {
      Object.assign(item, { id: Generator.alpha(8) })
    }

    return {
      fazCarNumber: item.fazCarNumber,
      producerName: item.producerName,
      fazName: item.fazName,
      latitude: item.latitude,
      longitude: item.longitude,
      citie: item.citie,
      state: item.state,
      sifNumber: item.sifNumber
    }
  }

  transformMany(item: Record<string, any>): KpisPropertiesDetailsView {
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
