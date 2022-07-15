import bcrypt from 'bcrypt'
import { get } from 'lodash'

import { cypher as config } from '@/Config'

interface CypherEngine {
  encrypt(raw: string): Promise<string>
  check(raw: string, e: string): Promise<boolean>
}

class BcryptAdapter implements CypherEngine {
  constructor(private rounds) {}

  async encrypt(raw: string): Promise<string> {
    return await bcrypt.hash(raw, this.rounds)
  }

  async check(raw: string, e: string): Promise<boolean> {
    return await bcrypt.compare(raw, e)
  }
}

export class Cypher {
  engine: CypherEngine

  constructor({ engine, rounds } = config) {
    const engines = { bcrypt: BcryptAdapter }

    const Engine = get(engines, engine)
    this.engine = new Engine(rounds)
  }

  public encrypt(raw: string) {
    return this.engine.encrypt(raw)
  }

  public check(raw: string, e: string) {
    return this.engine.check(raw, e)
  }
}
