import { BAD_REQUEST } from 'http-status'
import { pick } from 'lodash'
import { ValidationError } from 'yup'

import { $errors } from '@/Shared/Utils'

export class AppValidationError extends Error {
  public readonly code: string
  public readonly errors: Record<string, unknown>
  public readonly status: number

  constructor(validationError: ValidationError) {
    super($errors.validationFails.code)

    this.code = $errors.validationFails.code
    this.message = $errors.validationFails.message
    this.name = $errors.validationFails.code
    this.status = BAD_REQUEST

    this.errors = Object.fromEntries(
      validationError.inner.map(({ path, message, params }) => {
        const { label = '' } = params as { label: string }
        const key = label || path
        const _message = message
          .replace(label, '')
          .replace(path, '')
          .trim()

        return [key, _message]
      })
    )

    Object.setPrototypeOf(this, AppValidationError.prototype)
  }

  public toJSON(): Record<string, any> {
    return pick(this, 'code', 'errors', 'message')
  }
}
