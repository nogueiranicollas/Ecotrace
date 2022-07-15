import { Req } from '@/Shared/Protocols'

import { CompanyGroupProfile as Entity } from './companyGroupProfile.entity'
import { Repository } from './companyGroupProfile.repository'

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
