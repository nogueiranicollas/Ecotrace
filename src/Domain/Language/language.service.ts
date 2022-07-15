import { Req } from '@/Shared/Protocols'

import { Language as Entity } from './language.entity'
import { Repository } from './language.repository'

export class Service {
  private $repo: Repository

  constructor({ $Repository = Repository } = {}) {
    this.$repo = new $Repository()
  }

  public async find(_req: Req): Promise<Entity[]> {
    const found = await this.$repo.find()
    return found
  }
}
