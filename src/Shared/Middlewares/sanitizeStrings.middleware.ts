import { Request, Response, NextFunction } from 'express'

export default function Auth(req: Request, _res: Response, next: NextFunction) {
  const { body } = req

  const sanitizedBody = Object.fromEntries(
    Object.keys(body).map(key => {
      if (!body[key]) return [key, body[key]]
      if (!(typeof body[key] === 'string')) return [key, body[key]]
      return [key, body[key].trim()]
    })
  )
  Object.assign(req, { body: sanitizedBody })

  return next()
}
