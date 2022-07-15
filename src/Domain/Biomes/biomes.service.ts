import { Req } from '@/Shared/Protocols'

import { Biome as Entity } from './biomes.entity'
import { Repository } from './biomes.repository'

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
