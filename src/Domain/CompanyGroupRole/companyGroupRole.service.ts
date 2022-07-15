import { Req } from '@/Shared/Protocols'

import { CompanyGroupRole as Entity } from './companyGroupRole.entity'
import { Repository } from './companyGroupRole.repository'

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
