import { getCustomRepository } from 'typeorm'

export function getTypeORMCustomRepo<T>(repo) {
  return function _get(): T {
    return getCustomRepository(repo)
  }
}
