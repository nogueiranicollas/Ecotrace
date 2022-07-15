import { Repository } from '@/Domain/UserPermission/userPermission.repository'
import { AppError } from '../Protocols'
import { $errors } from './errors.utils'

export class CheckPermissions {
  private $repo: Repository

  constructor({ $Repository = Repository } = {}) {
    this.$repo = new $Repository()
  }

  public async permission(permissions, user) {
    const found = await this.$repo.findOne(user.bearer.id)

    if (!found[permissions]) {
      throw new AppError($errors.invalidAccess, {
        email: user.bearer.email,
        role: user.bearer.role.tag
      })
    }
    return found[permissions]
  }
}
