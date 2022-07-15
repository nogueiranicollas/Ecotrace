import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddNullableStateCityMircoregionOnCompanyTable1655687160602
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE companies ALTER COLUMN state DROP NOT NULL;
      ALTER TABLE companies ALTER COLUMN city DROP NOT NULL;
      ALTER TABLE companies ALTER COLUMN microregion DROP NOT NULL;
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    ALTER TABLE companies ALTER COLUMN state ADD NOT NULL;
    ALTER TABLE companies ALTER COLUMN city ADD NOT NULL;
    ALTER TABLE companies ALTER COLUMN microregion ADD NOT NULL;
    `)
  }
}
