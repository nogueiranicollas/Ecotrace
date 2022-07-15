import { UserPermissions } from '@/Domain/UserPermission/userPermission.entity'

type UserPermissionsView = Record<string, any>

export class View {
  transformOne(item: UserPermissions): UserPermissionsView {
    return {
      permissions: {
        userId: item.userId,
        retail: item.retail,
        provider: item.provider,
        weaving: item.weaving,
        wiring: item.wiring,
        productiveChain: item.productiveChain,
        traceabilityProperty: item.traceabilityProperty,
        blockchainHistory: item.blockchainHistory,
        users: item.users,
        industries: item.industries,
        industriesGroup: item.industriesGroup,
        propertyRegister: item.propertyRegister
      }
    }
  }

  transformMany(items: UserPermissions[]): UserPermissionsView[] {
    return items.map(this.transformOne)
  }
}
