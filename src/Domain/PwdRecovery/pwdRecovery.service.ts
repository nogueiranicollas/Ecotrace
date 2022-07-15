import { Req } from '@/Shared/Protocols'
import { Cypher } from '@/Shared/Providers'
import { PasswordRecovery } from '@/Shared/Services'

import { Repository as UserRepo } from '@/Domain/User/user.repository'

import { Validator } from './pwdRecovery.validator'

export class Service {
  private $cypher: Cypher
  private $pwdRecovery: PasswordRecovery
  private $userRepo: UserRepo
  private $validator: typeof Validator

  constructor({
    $Cypher = Cypher,
    $Validator = Validator,
    $UserRepo = UserRepo,
    $PwdRecovery = PasswordRecovery
  } = {}) {
    this.$cypher = new $Cypher()
    this.$pwdRecovery = new $PwdRecovery()
    this.$userRepo = new $UserRepo()
    this.$validator = $Validator
  }

  public async request(req: Req): Promise<boolean> {
    const { payload, validationErrors } = await this.$validator.validateBody<{
      email: string
    }>(req)
    if (!payload) throw validationErrors

    const { email } = payload
    const user = await this.$userRepo.findOne({ email })

    const token = await this.$pwdRecovery.notify(user)
    await this.$userRepo.updateOne({ id: user.id, pwdRecoveryToken: token })
    return true
  }

  public async reset(req: Req): Promise<boolean> {
    const { payload, validationErrors } = await this.$validator.validateBody<{
      email: string
      password: string
      token: string
    }>(req)
    if (!payload) throw validationErrors

    const { email, token: pwdRecoveryToken, password } = payload
    const user = await this.$userRepo.findOne({ email, pwdRecoveryToken })
    const pwd = await this.$cypher.encrypt(password)
    await this.$userRepo.updateOne({ pwd, id: user.id, pwdRecoveryToken: null })

    return true
  }
}
