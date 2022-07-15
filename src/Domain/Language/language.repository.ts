import { EntityRepository, Repository as _Repository } from 'typeorm'

import { $errors, getTypeORMCustomRepo } from '@/Shared/Utils'

import { Language } from './language.entity'
import { AppError } from '@/Shared/Protocols'

interface LanguageRepo extends _Repository<Language> {}

@EntityRepository(Language)
class TypeORMRepo extends _Repository<Language> implements LanguageRepo {}

export class Repository {
  private $getRepo: () => LanguageRepo

  constructor({ repo = getTypeORMCustomRepo<LanguageRepo>(TypeORMRepo) } = {}) {
    this.$getRepo = repo
  }

  public async find(query = {}) {
    const found = await this.$getRepo().find({ where: query })
    if (!found.length) throw new AppError($errors.notFound, { query })
    return found
  }

  public async findOne(query = {}) {
    const found = await this.$getRepo().findOne({ where: query })
    if (!found) {
      throw new AppError({ ...$errors.notFound, details: { query } })
    }

    return found
  }
}
