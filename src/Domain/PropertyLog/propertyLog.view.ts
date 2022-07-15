import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { omit } from 'lodash'
import { ACTION } from '../Properties/property.enum'

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
      const omittedKeys = [
        'area',
        'id',
        'cityId',
        'createdAt',
        'updatedAt',
        'producer',
        'name'
      ]
      const payload = JSON.parse(item.log)

      const data =
        item.action === ACTION.Insert ? item.createdAt : item.updatedAt
      const city = payload.city[0]

      return {
        ...omit(payload, omittedKeys),
        ...omit(item, ['log', 'createdAt', 'updatedAt']),
        ...payload.producer,
        action:
          item.action === ACTION.Insert
            ? 'criação'
            : item.action === ACTION.Update
            ? 'atualização'
            : 'importação',
        city: `${city.name} - ${city.uf}`,
        data: format(data, 'dd/MM/yyyy HH:mm', { locale: ptBR }),
        lat: payload.lat || '',
        lng: payload.lng || '',
        user: payload.user.name,
        propertyName: payload.name
      }
    }
    const data = items.map(project)

    return {
      items: data,
      pagination: { ...formattedPagination }
    }
  }
}
