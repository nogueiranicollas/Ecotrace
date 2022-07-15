import { Req } from '@/Shared/Protocols'

import { Signup } from './signup.entity'
import { Repository, SignupPayload } from './signup.repository'
import { Validator } from './signup.validator'

export class Service {
  private $userRepo: Repository
  private $validator: Validator

  constructor({ $Repo = Repository, $Validator = Validator } = {}) {
    this.$userRepo = new $Repo()
    this.$validator = new $Validator()
  }

  public async handle(req: Req): Promise<Signup> {
    const { payload, validationErrors } = await this.$validator.validateBody<
      SignupPayload
    >(req)
    if (!payload) throw validationErrors

    const user = await this.$userRepo.insertOne(payload)
    return user
  }
}
