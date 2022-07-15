import { Request, Response, NextFunction } from 'express'
import { Token } from '@/Domain/Token/token.entity'
import { AppError } from '../Protocols'
import { $errors } from '../Utils'

export async function authUserRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { user } = req as Request & { user: Token }
  const tag = user.bearer.role.tag

  if (tag === 'visual') {
    throw new AppError($errors.invalidAccess, {
      email: user.bearer.email,
      role: user.bearer.role.tag
    })
  }

  return next()
}
