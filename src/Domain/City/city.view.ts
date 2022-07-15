import { City } from '@/Domain/City/city.entity'

export class View {
  transformToList(item: Record<string, any>) {
    function project(item: City) {
      return {
        title: item.name,
        value: item.id,
        codeIbge: item.codeIBGE,
        state: item.uf
      }
    }
    const data = item.map(project)

    return data
  }
}
