import { getCustomRepository } from 'typeorm'

import { City as Entity } from './city.entity'
import { City as Repo } from './city.repository'

export class City {
  private getRepo() {
    return getCustomRepository(Repo)
  }

  public async findOneByCityName(cityName: string): Promise<Entity> {
    const repo = this.getRepo()

    const found = await repo
      .createQueryBuilder('city')
      .where('unaccent(city.name) ILIKE unaccent(:cityName)', { cityName })
      .getOne()

    return found as Entity
  }

  public async find(query: Record<string, any>): Promise<Entity[] | null> {
    const repo = this.getRepo()
    return await repo.find(query)
  }

  public async findByUF(query: Record<string, any>): Promise<Entity[]> {
    const repo = this.getRepo()
    return await repo.find(query)
  }
}
