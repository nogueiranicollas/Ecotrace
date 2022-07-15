import { Req } from '@/Shared/Protocols'

import { UserRole as Entity } from './userRole.entity'
import { Repository } from './userRole.repository'

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
