import { omit, orderBy, pick } from 'lodash'

type CompanyGroup = Record<string, any>
type CompanyGroupView = Record<string, any>
type CompanyGroupOptions = {
  label: string
  value: string
}

export class View {
  transformToOptions(items: CompanyGroup[]): CompanyGroupOptions[] {
    return items.map((item) => ({ label: item.name, value: item.id }))
  }

  transformOne(item: CompanyGroup): CompanyGroupView {
    const invisibleKeys = [
      'createdAt',
      'dataSource',
      'deletedAt',
      'groupId',
      'updatedAt'
    ]

    const payload = omit(item, invisibleKeys)
    const companies = (() => {
      if (item.companies && item.companies.items) return item.companies.items
      return []
    })().map((each) => {
      return pick(each, 'id', 'name', 'fancyName', 'cnpj')
    })

    // if(item.companyGroupProfiles.length)
    // {
    //   const profiles = item.companyGroupProfiles.map((each) => {
    //     return pick(each, 'id', 'name', 'tag')
    //   })
    //   return {
    //     ...payload,
    //     companies,
    //     companyGroupProfiles: profiles
    //   }
    // }


    if (companies.length) {
      Object.assign(payload, {
        companies: {
          ...item.companies,
          items: orderBy(
            companies,
            ['cnpj', 'createdAt', 'name'],
            ['asc', 'desc', 'asc']
          )
        }
      })
    }

    return payload
  }

  transformMany(item: Record<string, any>): CompanyGroupView {
    const { items, pagination } = item

    const { limit, page, totalItems, totalPages } = pagination
    const formattedPagination = {
      limit,
      page,
      totalItems,
      totalPages
    }

    const data = items.map(this.transformOne).map((each) => ({
      ...omit(each, 'companies'),
      total: each.companies.length
    }))

    return {
      items: data,
      pagination: formattedPagination
    }
  }
}
