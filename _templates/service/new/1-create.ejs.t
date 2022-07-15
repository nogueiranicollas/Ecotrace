---
to: src/Domain/<%= Name %>/<%= name %>.service.ts
unless_exists: true
---
import { Request } from 'express'

import { AppError } from '@/Shared/Protocols'
import { $errors } from '@/Shared/Utils'

import { <%= Name %> as Entity } from './<%= name %>.entity'
import { Validator } from './<%= name %>.validator'
import { Repository } from './<%= name %>.repository'

export class Service {
  private $repo: Repository
  private $validator: typeof Validator

  constructor({ $Validator = Validator, $Repository = Repository } = {}) {
    this.$repo = new $Repository()
    this.$validator = $Validator
  }

  public async find(): Promise<Entity[]> {
    const found = await this.$repo.find()
    return found
  }

  public async findOne(req: Request): Promise<Entity> {
    const { id } = req.params
    const query = { id }

    const found = await this.$repo.findOne(query)
    return found
  }

  public async insertOne(req: Request): Promise<Entity> {
    const [isValid, validationError] = await this.$validator.validateBody(req)
    if (!isValid) {
      Object.assign(req, { error: validationError })
      throw new AppError($errors.validationFails)
    }

    const { body: payload } = req
    const created = await this.$repo.insertOne(payload)

    return created
  }

  public async updateOne(req: Request): Promise<Entity> {
    const [
      isParamsValid,
      paramsValidationError
    ] = await this.$validator.validateParams(req)
    if (!isParamsValid) {
      Object.assign(req, { error: paramsValidationError })
      throw new AppError($errors.validationFails)
    }

    const [
      isBodyValid,
      bodyValidationError
    ] = await this.$validator.validateBody(req)
    if (!isBodyValid) {
      Object.assign(req, { error: bodyValidationError })
      throw new AppError($errors.validationFails)
    }
    const { body: payload } = req
    const { id } = req.params

    const updated = await this.$repo.updateOne({ ...payload, id })
    return updated
  }

  public async removeOne(req: Request): Promise<string> {
    const [isValid, validationError] = await this.$validator.validateParams(req)
    if (!isValid) {
      Object.assign(req, { error: validationError })
      throw new Error($errors.validationFails.code)
    }
    const { id } = req.params

    await this.$repo.removeOne({ id })
    return id
  }
}
