import {
  EntityRepository,
  getCustomRepository,
  Repository as _Repository
} from 'typeorm'

import { getTypeORMCustomRepo } from '@/Shared/Utils'

import { Producer } from './producer.entity'

interface ProducerRepo extends _Repository<Producer> {}

@EntityRepository(Producer)
class TypeORMRepo extends _Repository<Producer> implements ProducerRepo {}

export class Repository {
  private $getRepo: () => ProducerRepo

  constructor({ repo = getTypeORMCustomRepo<ProducerRepo>(TypeORMRepo) } = {}) {
    this.$getRepo = repo
  }
}

export function getRepo({
  $getCustomRepository = getCustomRepository,
  Repo = Repository
} = {}): Repository {
  return $getCustomRepository(Repo)
}
