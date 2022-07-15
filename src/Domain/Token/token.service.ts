import { pick } from 'lodash'

import { Req } from '@/Shared/Protocols'
import { JWT } from '@/Shared/Providers'
import { IP as IPUtils } from '@/Shared/Utils'

import { User } from '@/Domain/User/user.entity'

import { Token } from './token.entity'
import { Repository, TokenQuery } from './token.repository'

type TokenPayload = { req: Req; bearer: User }

export class Service {
  private $repo: Repository
  private $jwt: JWT

  private $ip: typeof IPUtils

  constructor({ $Repository = Repository, $JWT = JWT, $IP = IPUtils } = {}) {
    this.$repo = new $Repository()
    this.$jwt = new $JWT()
    this.$ip = $IP
  }

  public async findOne(query: TokenQuery): Promise<Token | null> {
    const found = await this.$repo.findOne(query)
    if (!found) return null
    return found
  }

  public async create({ req, bearer }: TokenPayload): Promise<Token> {
    const { userAgent } = req.body
    const IP = this.$ip.extract(req)
    const jwt = await this.$jwt.sign(pick(bearer, 'id', 'firstName', 'email'))

    const created = await this.$repo.insertOne({ bearer, IP, userAgent, jwt })
    return created
  }
}
