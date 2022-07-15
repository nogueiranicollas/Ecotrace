import { EntityRepository, Repository as _Repository } from 'typeorm'

import { $errors, getTypeORMCustomRepo } from '@/Shared/Utils'

import { Biome } from './biomes.entity'
import { AppError } from '@/Shared/Protocols'

interface BiomeRepo extends _Repository<Biome> {}

@EntityRepository(Biome)
class TypeORMRepo extends _Repository<Biome> implements BiomeRepo {}

export class Repository {
  private $getRepo: () => BiomeRepo

  constructor({ repo = getTypeORMCustomRepo<BiomeRepo>(TypeORMRepo) } = {}) {
    this.$getRepo = repo
  }

  public async find(query = {}) {
    const found = await this.$getRepo().find({ where: query })
    if (!found.length) throw new AppError($errors.notFound, { query })
    return found
  }
}
