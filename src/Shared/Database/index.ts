import { Knex } from './knex'
import { Postgres } from './typeORM'

import { dataWarehouses } from '@/Config'
export class DB {
  public static async connect() {
    await Promise.all([
      Postgres.connect(),
      Object.values(dataWarehouses).map((dwConfig) => Knex.connect(dwConfig))
    ])
  }
}
