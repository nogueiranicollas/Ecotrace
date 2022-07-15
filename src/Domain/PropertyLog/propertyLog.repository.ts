import {
  EntityRepository,
  getCustomRepository,
  Repository as _Repository
} from 'typeorm'
import { omit } from 'lodash'

import { AppError } from '@/Shared/Protocols'
import { $errors, getTypeORMCustomRepo, QueryUtil } from '@/Shared/Utils'

import { PropertyLog } from '@/Domain/PropertyLog/propertyLog.entity'
import { City } from '@/Domain/City/city.entity'
import { Property } from '@/Domain/Properties/property.entity'
import { User } from '@/Domain/User/user.entity'

interface PropertyLogRepo extends _Repository<PropertyLog> {}

@EntityRepository(PropertyLog)
class TypeORMRepo extends _Repository<PropertyLog> implements PropertyLogRepo {}

export class Repository {
  private $getRepo: () => PropertyLogRepo

  private $query: QueryUtil

  constructor({
    repo = getTypeORMCustomRepo<PropertyLogRepo>(TypeORMRepo),
    $Query = QueryUtil
  } = {}) {
    this.$getRepo = repo

    this.$query = new $Query()
  }

  public async add(payload: Partial<PropertyLog>): Promise<PropertyLog> {
    const repo = this.$getRepo()
    const propertyLog = repo.create(payload)
    return await repo.save(propertyLog)
  }

  public async find({ limit, page, column, direction }, query = {}) {
    const where = this.$query.handle(query)

    const command = this.$getRepo()
      .createQueryBuilder('propertyLog')
      .where(where)

    const res = await Promise.all([
      command.getCount(),
      command
        .skip(page * limit)
        .take(limit)
        .orderBy(column, direction.toUpperCase())
        .getMany()
    ])

    const [totalItems, items] = res

    const count = Number(totalItems)

    const totalPages =
      totalItems <= limit ? 1 : parseInt((count / limit).toFixed())

    const found = {
      items,
      pagination: {
        totalPages,
        totalItems: count,
        page,
        limit
      }
    }

    if (!found.items.length) throw new AppError($errors.notFound, { query })
    return found
  }

  public async upsertLog(
    action: string,
    city: City[],
    property: Property,
    user: User
  ) {
    const promisePropertyLog = property.producers.map((producer) => {
      const payloadPropertyLog: Partial<PropertyLog> = {
        action,
        authorId: user.id,
        log: JSON.stringify({
          ...omit(property, 'producers'),
          producer,
          city,
          user
        }),
        propertyId: property.id,
        producerId: producer.id
      }
      this.add(payloadPropertyLog)
    })
    await Promise.all(promisePropertyLog)
  }
}

export function getRepo({
  $getCustomRepository = getCustomRepository,
  Repo = Repository
} = {}): Repository {
  return $getCustomRepository(Repo)
}
