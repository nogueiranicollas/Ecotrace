import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from 'typeorm'

export class CompanyGroupNewRelations1653323836059
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'company_group',
      new TableColumn({
        name: 'company_group_role_id',
        type: 'varchar'
      })
    )

    await queryRunner.addColumn(
      'company_group',
      new TableColumn({
        name: 'company_group_profile_id',
        type: 'varchar'
      })
    )

    await queryRunner.createForeignKey(
      'company_group',
      new TableForeignKey({
        columnNames: ['company_group_role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'company_group_role',
        onDelete: 'NO ACTION'
      })
    )

    await queryRunner.createForeignKey(
      'company_group',
      new TableForeignKey({
        columnNames: ['company_group_profile_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'company_group_profile',
        onDelete: 'NO ACTION'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('company_group')
    const foreignKeyCompanyGroupProfile = table!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('company_group_profile_id') !== -1
    )
    const foreignKeyCompanyGroupRole = table!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('company_group_role_id') !== -1
    )
    await queryRunner.dropForeignKey(
      'company_group',
      foreignKeyCompanyGroupProfile!
    )
    await queryRunner.dropForeignKey(
      'company_group',
      foreignKeyCompanyGroupRole!
    )
    await queryRunner.dropColumn('company_group', 'company_group_profile_id')
    await queryRunner.dropColumn('company_group', 'company_group_role_id')
  }
}
