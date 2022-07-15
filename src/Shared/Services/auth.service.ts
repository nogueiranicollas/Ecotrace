import { Request } from 'express'

import { auth as config } from '@/Config'

import { USER_ROLES } from '@/Shared/Constants'
import { AppError } from '@/Shared/Protocols'
import { JWT } from '@/Shared/Providers'
import { $errors, IP, Sanitizer } from '@/Shared/Utils'

import { Service as App } from '@/Domain/App/app.service'
import { Service as Token } from '@/Domain/Token/token.service'
import { Repository as UserRepo } from '@/Domain/User/user.repository'

export class Auth {
  private $app: App
  private $jwt: JWT
  private $token: Token

  private $IP: typeof IP

  private config: typeof config

  constructor({
    $config = config,
    $App = App,
    $IPUtil = IP,
    $JWT = JWT,
    $Token = Token
  } = {}) {
    this.$app = new $App()
    this.$jwt = new $JWT()
    this.$token = new $Token()

    this.$IP = $IPUtil

    this.config = $config
  }

  private async getUserAllowedGroups(userId: string) {
    const user = await new UserRepo().findOneOrNull({ id: userId })
    if (!user) throw new AppError($errors.unauthorized)
    const retails = new Set(
      user._retails
        .map(({ group }) =>
          group.retails.map(({ cnpj }) => {
            return Sanitizer.CNPJ(cnpj)
          })
        )
        .flat()
    )
    const companies = new Set(
      user._companies
        .map(({ group }) =>
          group.companies.map(({ cnpj }) => {
            return Sanitizer.CNPJ(cnpj)
          })
        )
        .flat()
    )
    const accesses = {
      retails: Array.from(retails),
      companies: Array.from(companies)
    }
    return accesses
  }

  public async handle(req: Request) {
    if (!this.config.enabled) {
      return {
        bearer: {
          firstName: 'User',
          lastName: 'Disabled',
          CPF: '123.456.768-90',
          email: 'disabled@email.com',
          phone: '(15) 98142-8968',
          lang: 'pt-BR',
          department: 'Development',
          roleId: '123-abc-456'
        },
        accesses: { retails: ['*'], companies: ['*'] },
        app: { tag: 'dev' }
      }
    }

    const header = req.header(this.config.header)
    if (!header) throw new AppError($errors.tokenNotFound)

    const app = await this.$app.findOne(req)
    if (!app) throw new AppError($errors.unauthorized)

    const [, token] = header
      .split(this.config.prefix)
      .map((e) => String(e).trim())
    if (!token) throw new AppError($errors.tokenNotFound)

    const isValid = await this.$jwt.verify(token)
    if (!isValid) throw new AppError($errors.invalidToken)

    const IP = this.$IP.extract(req)
    const userAgent = String(req.header('User-Agent'))

    const found = await this.$token.findOne({ jwt: token, IP, userAgent })
    if (!found) throw new AppError($errors.unauthorized)

    let accesses = {}
    if (found.bearer.role.tag !== USER_ROLES.admin) {
      accesses = await this.getUserAllowedGroups(found.bearer.id)
    }

    return { bearer: found.bearer, accesses, app }
  }
}
