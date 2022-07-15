import { pick } from 'lodash'

import { UserRetail } from '@/Domain/UserRetail/userRetail.entity'
import { UserCompany } from '@/Domain/UserCompany/userCompany.entity'

import { Formatter } from '@/Shared/Utils'
import {
  UserWithPermissions,
  FilterOption,
  SelectOption,
  UserFilterOptions,
  UserView
} from './user.type'
import { User } from './user.entity'

export class View {
  joinAccessesGroups({
    _retails: retails = [],
    _companies: companies = []
  }: {
    _retails: UserRetail[]
    _companies: UserCompany[]
  }) {
    const _retails = retails
      .filter(({ group }) => group)
      .map(({ group }) => ({
        admin: { email: group.adminEmail, name: group.adminName },
        id: group.id,
        name: group.name,
        type: 'retail'
      }))
    const _companies = companies
      .filter(({ group }) => group)
      .map(({ group }) => ({
        admin: { email: group.adminEmail, name: group.adminName },
        id: group.id,
        name: group.name,
        type: 'company'
      }))

    return [..._retails, ..._companies]
  }

  transformToList(item: Record<string, any>): UserView {
    const { items, pagination } = item

    const { limit, page, totalItems, totalPages } = pagination
    const formattedPagination = { limit, page, totalItems, totalPages }

    const data = items.map((e) => {
      const keys = [
        'CPF',
        'department',
        'email',
        'id',
        'name',
        'phone',
        'companiesGroups'
      ]
      return {
        ...pick(e, keys),
        // groups: this.joinAccessesGroups(e),
        role: e.role.description
      }
    })

    return {
      items: data,
      pagination: formattedPagination
    }
  }

  transformFilterOptions({ retails, companies }: UserFilterOptions): {
    companies: SelectOption[]
    retails: SelectOption[]
  } {
    function project({ id, name }: FilterOption) {
      return { label: name, value: id }
    }

    return { companies: companies.map(project), retails: retails.map(project) }
  }

  transformOne(item: UserWithPermissions | User): UserView {
    const keys = [
      'CPF',
      'department',
      'email',
      'emailRecovery',
      'firstName',
      'id',
      'lang',
      'lastName',
      'phone',
      'phoneRecovery',
      'lastSignIn',
      'permissions',
      'languageId',
      'companiesGroups'
    ]
    const user = {
      ...pick(item, keys),
      avatar: (() => {
        if (item.avatar) return pick(item.avatar, 'src', 'filename')
        return null
      })(),
      createdAt: Formatter.date(item.createdAt),
      groups: this.joinAccessesGroups(item),
      lastSignIn: Formatter.date(item.lastSignIn || new Date()),
      roleId: item.roleId || item.role.id
    }
    if (item.role)
      Object.assign(user, {
        role: item.role.description,
        roleTag: item.role.tag
      })

    return user
  }

  transformMany(items: UserWithPermissions[]): UserView[] {
    return items.map(this.transformOne)
  }
}
