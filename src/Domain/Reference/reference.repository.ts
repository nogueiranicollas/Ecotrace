import {
  EntityRepository,
  getCustomRepository,
  Repository as _Repository
} from 'typeorm'
import { Reference } from './reference.entity'

@EntityRepository(Reference)
export class Repository extends _Repository<Reference> {}

export function getRepo({
  $getCustomRepository = getCustomRepository,
  Repo = Repository
} = {}): Repository {
  return $getCustomRepository(Repo)
}
