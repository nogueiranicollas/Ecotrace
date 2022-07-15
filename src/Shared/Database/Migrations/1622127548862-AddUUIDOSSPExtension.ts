import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUUIDOSSPExtension1622127548862 implements MigrationInterface {
  private ext = 'uuid-ossp'

  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "${this.ext}";`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP EXTENSION IF EXISTS "${this.ext}";`)
  }
}
