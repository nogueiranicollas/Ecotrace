import { pick } from 'lodash'

type RetailGroup = Record<string, any>
type RetailGroupView = Record<string, any>

type RetailGroupOptions = {
  label: string
  value: string
}[]

export class View {
  transformToOptions(items: RetailGroup[]): RetailGroupOptions {
    return items.map(({ id: value, name: label }) => ({ label, value }))
  }

  transformToList(item: Record<string, any>): RetailGroupView {
    const { items, pagination } = item

    const { limit, page, totalItems, totalPages } = pagination
    const formattedPagination = {
      limit,
      page,
      totalItems,
      totalPages
    }

    function project(item: RetailGroup) {
      const total = item.retails.length || 0
      return {
        ...pick(item, 'adminEmail', 'id', 'name', 'visible'),
        total
      }
    }

    const data = items.map(project)

    return {
      items: data,
      pagination: formattedPagination
    }
  }

  transformOne(item: RetailGroup): RetailGroupView {
    return item
  }

  transformMany(items: RetailGroup[]): RetailGroupView[] {
    return items.map(this.transformOne)
  }
}
