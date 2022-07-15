import { Request, Response, NextFunction } from 'express'

import { Auth as $Auth } from '@/Shared/Services'

export default async function Auth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const user = await new $Auth().handle(req)
  Object.assign(req, { user })

  return next()
}
