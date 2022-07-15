import { CompanyGroupRole } from '@/Domain/CompanyGroupRole/companyGroupRole.entity'

type CompanyGroupRoleView = Record<string, any>

export class View {
  transformOne(item: CompanyGroupRole): CompanyGroupRoleView {
    return { id: item.id, label: item.description, tag: item.tag }
  }

  transformMany(items: CompanyGroupRole[]): CompanyGroupRoleView[] {
    return items.map(this.transformOne)
  }
}
