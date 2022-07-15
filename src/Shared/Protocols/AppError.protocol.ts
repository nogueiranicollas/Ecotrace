import { BAD_REQUEST } from 'http-status'
import { pick } from 'lodash'

type Context = {
  message?: string
  code?: string
  status?: number
  details?: any
}

export class AppError extends Error {
  public readonly code: string
  public readonly details: Record<string, any>
  public readonly message: string
  public readonly name: string
  public readonly status: number

  constructor(
    { code = 'APP_ERROR', message = 'Error', status = BAD_REQUEST }: Context,
    details = {}
  ) {
    super(message)

    this.code = code
    this.details = details
    this.message = message
    this.name = code
    this.status = status

    Object.setPrototypeOf(this, AppError.prototype)
  }

  public toJSON(): Record<string, any> {
    const payload = pick(this, 'code', 'message')

    if (Object.keys(this.details).length) {
      Object.assign(payload, pick(this, 'details'))
    }

    return payload
  }
}
