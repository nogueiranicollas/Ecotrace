import { Token } from '@/Domain/Token/token.entity'

import { UserPermissions } from '@/Domain/UserPermission/userPermission.entity'
import { Language } from '../Language/language.entity'

type SigninView = Record<string, any>

export class View {
  transformOne(
    item: Token,
    permissions: UserPermissions,
    language: Language
  ): SigninView {
    return {
      userId: permissions.userId,
      token: item.jwt,
      avatar: item.bearer.avatar ? item.bearer.avatar.src : null,
      tag: 'admeco',
      profile: { name: `${item.bearer.firstName} ${item.bearer.lastName}` },
      permissions: {
        retail: permissions.retail,
        provider: permissions.provider,
        weaving: permissions.weaving,
        wiring: permissions.wiring,
        productiveChain: permissions.productiveChain,
        traceabilityProperty: permissions.traceabilityProperty,
        blockchainHistory: permissions.blockchainHistory,
        users: permissions.users,
        industries: permissions.industries,
        industriesGroup: permissions.industriesGroup,
        propertyRegister: permissions.propertyRegister
      },
      language: {
        language: language.language,
        id: language.id,
        tag: language.tag
      }
    }
  }
}
