import * as Yup from 'yup'

import { AppError, AppValidationError, Req } from '@/Shared/Protocols'

type Schemas = {
  default?: Yup.Schema<any>
  destroy?: Yup.Schema<any>
  params?: Yup.Schema<any>
  query?: Yup.Schema<any>
  store?: Yup.Schema<any>
  update?: Yup.Schema<any>
}

interface ValidationResponse<T = Record<string, any>> {
  payload: T | null
  validationErrors: AppValidationError | AppError | null
}

const __INCOMPLETE_SCHEMA =
  'You must provide a default schema, or store and update schema'

export class YupValidator {
  private schemas: Schemas = {}

  constructor(schemas?: Schemas) {
    if (schemas) {
      if (schemas.default) this.schemas = schemas
      else if (schemas.store && schemas.update) this.schemas = schemas
      else if (schemas.query || schemas.params) this.schemas = schemas
      else throw new Error(__INCOMPLETE_SCHEMA)
    }
  }

  public async validate<T>(
    payload: Record<string, any>,
    schema: Yup.Schema<any>
  ): Promise<ValidationResponse<T>> {
    try {
      const transformed = await schema.validate(payload, {
        abortEarly: false,
        stripUnknown: true
      })
      return { payload: transformed, validationErrors: null }
    } catch (ex) {
      if (ex instanceof Yup.ValidationError) {
        return {
          payload: null,
          validationErrors: new AppValidationError(ex)
        }
      }

      return {
        payload: null,
        validationErrors: new AppError(ex as any)
      }
    }
  }

  private async chooseSchema({
    method
  }: Pick<Request, 'method'>): Promise<Yup.Schema<any>> {
    if (this.schemas.destroy && method === 'DELETE') return this.schemas.destroy
    if (this.schemas.store && method === 'POST') return this.schemas.store
    if (this.schemas.update && (method === 'PUT' || method === 'PATCH')) {
      return this.schemas.update
    }

    if (this.schemas.default) return this.schemas.default as Yup.Schema<any>

    throw new Error(__INCOMPLETE_SCHEMA)
  }

  public async validateBody<T = Record<string, any>>({ body, method }: Req) {
    return this.validate<T>(body, await this.chooseSchema({ method }))
  }

  public async validateQuery<T = Record<string, any>>({ query }: Req) {
    if (!this.schemas.query) throw new Error(__INCOMPLETE_SCHEMA)
    return this.validate<T>(query, this.schemas.query)
  }

  public async validateParams<T = Record<string, any>>({ params }: Req) {
    if (!this.schemas.params) throw new Error(__INCOMPLETE_SCHEMA)
    return this.validate<T>(params, this.schemas.params)
  }
}
