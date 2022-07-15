import { AppError, Req } from '@/Shared/Protocols'
import { $errors } from '@/Shared/Utils'

import { Service as $App } from '@/Domain/App/app.service'

export default async function Auth(req, _res, next): Promise<void> {
  const app = await new $App().findOne(req as Req)
  if (!app) throw new AppError($errors.unauthorized)
  Object.assign(req, { app })
  return next()
}
