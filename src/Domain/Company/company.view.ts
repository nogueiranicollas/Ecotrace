import { pick } from 'lodash'

import { Company } from '@/Domain/Company/company.entity'

type CompanyView = Record<string, any>

function mapPhoto(payload, key) {
  if (!payload[key]) return null
  return pick(payload[key], 'filename', 'id', 'src')
}

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
      const total = item.groups.length || 0
      const projection = pick(
        item,
        'cnpj',
        'fancyName',
        'id',
        'ie',
        'qualifications',
        'lat',
        'lng',
        'name',
        'status'
      )
      return { ...projection, total }
    }
    const data = items.map(project)

    return {
      items: data,
      pagination: formattedPagination
    }
  }

  public transformOne(item: Company): CompanyView {
    return {
      ...item,
      sifPhoto: mapPhoto(item, 'sifPhoto')
    }
  }

  transformMany(items: Company[]): CompanyView[] {
    return items.map(this.transformOne)
  }
}
