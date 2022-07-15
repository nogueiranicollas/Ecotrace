import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddMicroregionOnCompanyTable1655326271724
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'companies',
      new TableColumn({
        name: 'microregion',
        type: 'varchar',
        isNullable: true
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('companies', 'microregion')
  }
}
