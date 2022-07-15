import { UserRole } from '@/Domain/UserRole/userRole.entity'

type UserRoleView = Record<string, any>

export class View {
  transformOne(item: UserRole): UserRoleView {
    return { id: item.id, label: item.description, tag: item.tag }
  }

  transformMany(items: UserRole[]): UserRoleView[] {
    return items.map(this.transformOne)
  }
}
