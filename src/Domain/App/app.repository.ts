import {
  EntityRepository,
  FindConditions,
  Repository as _Repository
} from 'typeorm'

import { AppError } from '@/Shared/Protocols'
import { $errors, getTypeORMCustomRepo } from '@/Shared/Utils'

import { App } from './app.entity'

type AppQuery = FindConditions<App> | FindConditions<App>[]

interface AppRepo extends _Repository<App> {}

@EntityRepository(App)
class TypeORMRepo extends _Repository<App> implements AppRepo {}

export class Repository {
  private $getRepo: () => AppRepo

  constructor({ repo = getTypeORMCustomRepo<AppRepo>(TypeORMRepo) } = {}) {
    this.$getRepo = repo
  }

  private handleQuery(query: AppQuery) {
    function handle(condition: FindConditions<App>): FindConditions<App> {
      return { ...condition, isActive: true }
    }

    if (Array.isArray(query)) return query.map(handle)
    return handle(query)
  }

  public async findOne(query: AppQuery, { shouldThrow = false } = {}) {
    const where = this.handleQuery(query)

    const found = await this.$getRepo().findOne({ where })
    if (found) return found

    if (shouldThrow) throw new AppError($errors.notFound, { query })
    return null
  }
}
