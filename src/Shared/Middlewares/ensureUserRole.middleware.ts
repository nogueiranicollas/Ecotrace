import { Request } from 'express'
import { AppError } from '@/Shared/Protocols'
import { $errors } from '@/Shared/Utils'
import { Token } from '@/Domain/Token/token.entity'

export function ensureUserRoleMiddleware(role: string) {
  return async function ensureUserRole(req, _, next) {
    const { user } = req as Request & { user: Token }
    if (user.bearer.role.tag !== role) {
      throw new AppError($errors.invalidAccess, {
        email: user.bearer.email,
        role: user.bearer.role.tag
      })
    }
    return next()
  }
}
