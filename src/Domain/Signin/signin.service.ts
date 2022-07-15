import { pick } from 'lodash'

import { Repository as UserRepo } from '@/Domain/User/user.repository'
import { Repository as TokenRepo } from '@/Domain/Token/token.repository'
import { Repository as UserPermissionRepo } from '@/Domain/UserPermission/userPermission.repository'
import { Repository as LanguageRepo } from '@/Domain/Language/language.repository'

import { AppError, Req } from '@/Shared/Protocols'
import { Cypher, JWT } from '@/Shared/Providers'
import { $errors, IP } from '@/Shared/Utils'

import { Validator } from './signin.validator'

type SigninPayload = {
  email: string
  password: string
}

export class Service {
  private $validator: Validator

  private $userRepo: UserRepo
  private $tokenRepo: TokenRepo
  private $userPermissionRepo: UserPermissionRepo
  private $languageRepo: LanguageRepo

  private $cypher: Cypher
  private $jwt: JWT
  private $IP: typeof IP

  constructor({
    $Cypher = Cypher,
    $IP = IP,
    $JWT = JWT,
    $TokenRepo = TokenRepo,
    $UserPermissionRepo = UserPermissionRepo,
    $LanguageRepo = LanguageRepo,
    $UserRepo = UserRepo,
    $Validator = Validator
  } = {}) {
    this.$validator = new $Validator()
    this.$userPermissionRepo = new $UserPermissionRepo()
    this.$languageRepo = new $LanguageRepo()
    this.$tokenRepo = new $TokenRepo()
    this.$userRepo = new $UserRepo()

    this.$cypher = new $Cypher()
    this.$IP = $IP
    this.$jwt = new $JWT()
  }

  public async handle(req: Req) {
    const { payload, validationErrors } =
      await this.$validator.validateBody<SigninPayload>(req)
    if (!payload) throw validationErrors

    const userAgent = String(req.header('User-Agent'))
    if (!userAgent) {
      throw new AppError($errors.authenticationFails, {
        reason: 'unknown user agent'
      })
    }

    const { email, password } = payload
    const bearer = await this.$userRepo.findOneSignIn({ email })

    const isPassValid = await this.$cypher.check(password, bearer.pwd)
    if (!isPassValid) throw new AppError($errors.invalidPassword)

    const IP = this.$IP.extract(req)
    const jwt = await this.$jwt.sign(pick(bearer, 'id', 'email', 'firstName'))
    const created = await this.$tokenRepo.insertOne({
      jwt,
      IP,
      userAgent,
      bearer
    })
    await this.$userRepo.updateLastSignIn({
      ...pick(bearer, 'id'),
      lastSignIn: new Date()
    })

    const language = await this.$languageRepo.findOne({ id: bearer.languageId })
    const permissions = await this.$userPermissionRepo.findOneSignIn(bearer.id)

    return { created, permissions, language }
  }
}
