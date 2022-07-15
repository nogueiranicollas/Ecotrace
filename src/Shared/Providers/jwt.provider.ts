import jwt from 'jsonwebtoken'
import { get } from 'lodash'

import { jwt as $config } from '@/Config'
import { JWTConfig, JWTEngine } from '@/Shared/Protocols'

type TokenPayload = Record<string, any>

class JsonWebToken implements JWTEngine {
  constructor(private config: JWTConfig = $config) {}

  async verify(token: string) {
    try {
      const decoded = await jwt.verify(token, this.config.secret)
      return decoded as Record<string, any>
    } catch (_ex) {
      return {}
    }
  }

  async sign(payload: TokenPayload): Promise<string> {
    const token = await jwt.sign(payload, this.config.secret, {
      expiresIn: this.config.expiresIn
    })
    return token
  }
}

export class JWT {
  private engine: JWTEngine

  constructor({ engine, ...config } = $config) {
    const engines = { jsonwebtoken: JsonWebToken }
    const Engine = get(engines, engine, engines.jsonwebtoken)
    this.engine = new Engine(config)
  }

  public async verify(token: string) {
    return await this.engine.verify(token)
  }

  public async sign(payload: Record<string, any>) {
    return await this.engine.sign(payload)
  }
}
