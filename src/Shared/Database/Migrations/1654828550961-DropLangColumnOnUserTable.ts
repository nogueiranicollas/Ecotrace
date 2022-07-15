import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class DropLangColumnOnUserTable1654828550961
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'lang')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'lang',
        type: 'varchar',
        isNullable: true
      })
    )
  }
}
