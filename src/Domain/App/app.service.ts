import { Request } from 'express'

import { URL } from '@/Shared/Utils'

import { Repository } from './app.repository'
import { Validator } from './app.validator'

export class Service {
  private $repo: Repository
  private $validator: Validator

  private $URL: typeof URL

  constructor({
    $Repository = Repository,
    $Validator = Validator,
    $URLUtil = URL
  } = {}) {
    this.$repo = new $Repository()
    this.$validator = new $Validator()

    this.$URL = $URLUtil
  }

  public async findOne(req: Request) {
    const app = req.header('app')
    const { payload, validationErrors } = await this.$validator.validate(
      { app },
      Validator.schemas.header
    )
    if (!payload) throw validationErrors

    const URL = this.$URL.sanitize(String(app))
    return this.$repo.findOne({ URL })
  }
}
