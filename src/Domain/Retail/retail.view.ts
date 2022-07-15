import { pick } from 'lodash'

import { Retail } from '@/Domain/Retail/retail.entity'

type RetailView = Record<string, any>

export class View {
  transformToList(item: Record<string, any>) {
    const { items, pagination } = item

    const { limit, page, totalItems, totalPages } = pagination
    const formatedPagination = {
      limit,
      page,
      totalItems,
      totalPages
    }

    function project(item) {
      const total = item.groups.length || 0
      const projection = pick(
        item,
        'id',
        'status',
        'fancyName',
        'name',
        'inspectionType',
        'inspectionNum',
        'cnpj',
        'ie',
        'city',
        'state',
        'lat',
        'lng'
      )
      return { ...projection, total }
    }
    const data = items.map(project)

    return {
      items: data,
      pagination: { ...formatedPagination }
    }
  }

  transformOne(item: Retail): RetailView {
    return item
  }

  transformMany(items: Retail[]): RetailView[] {
    return items.map(this.transformOne)
  }
}
