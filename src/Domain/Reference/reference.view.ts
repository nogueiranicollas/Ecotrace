import { omit } from 'lodash'

import { Reference as Entity } from './reference.entity'
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
      if (item.flagStatus) {
        item.flagStatus = 'Bloqueada'
      } else {
        item.flagStatus = 'Liberada'
      }
      const omittedKeys = ['cityId', 'keyInsert']
      return omit(item, ...omittedKeys)
    }
    const data = items.map(project)

    return {
      items: data.sort((a, b) => {
        if (b.property) return 1
        if (a.property) return -1
        return 0
      }),
      pagination: { ...formattedPagination }
    }
  }

  transformOne(item: Entity): Record<string, any> {
    const omittedKeys = ['cityId', 'password']
    return omit(item, ...omittedKeys)
  }

  transformMany(items: Entity[]): Record<string, any>[] {
    return items.map((e) => this.transformOne(e))
  }
}
