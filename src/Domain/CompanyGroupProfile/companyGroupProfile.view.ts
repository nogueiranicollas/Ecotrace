import { CompanyGroupProfile } from '@/Domain/CompanyGroupProfile/companyGroupProfile.entity'

type CompanyGroupProfileView = Record<string, any>

export class View {
  transformOne(item: CompanyGroupProfile): CompanyGroupProfileView {
    return { id: item.id, label: item.description, tag: item.tag }
  }

  transformMany(items: CompanyGroupProfile[]): CompanyGroupProfileView[] {
    return items.map(this.transformOne)
  }
}
