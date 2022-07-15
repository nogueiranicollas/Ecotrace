import { UserPermissionPayload } from '../UserPermission/userPermission.repository'
import { User } from './user.entity'

export type SelectOption = {
  label: string
  value: string
}
export type FilterOption = {
  id: string
  name: string
}
export type UserFilterOptions = {
  companies: FilterOption[]
  retails: FilterOption[]
}

export type UserView = Record<string, any>

export type Permissions = {
  userId: string
  retail: boolean
  provider: boolean
  weaving: boolean
  wiring: boolean
  productiveChain: boolean
  traceabilityProperty: boolean
  blockchainHistory: boolean
  users: boolean
  industries: boolean
  industriesGroup: boolean
  propertyRegister: boolean
}

export type UserWithPermissions = User & {
  permissions: UserPermissionPayload
  languageId: string
}
