import { createConnection } from 'typeorm'

export class Postgres {
  public static async connect() {
    await createConnection()
  }
}
