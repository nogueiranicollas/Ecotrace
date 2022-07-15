import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddCountryOnCompanyTable1655490657210
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'companies',
      new TableColumn({
        name: 'country',
        type: 'varchar',
        isNullable: true
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('companies', 'country')
  }
}
