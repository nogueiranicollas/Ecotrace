import { knex, Knex as _Knex } from 'knex'

import { dataWarehouses, database } from '@/Config'

export class Knex {
  knex: _Knex

  constructor(config) {
    if (!this.knex) {
      this.knex = Knex.connect(config)
    }
  }

  public static connect(config) {
    return knex({
      client: 'pg',
      connection: config
    })
  }
}

export class PGDB extends Knex {
  constructor() {
    super(dataWarehouses.RENNER)
  }
}

export class B2B extends Knex {
  constructor() {
    super(database.main)
  }
}
