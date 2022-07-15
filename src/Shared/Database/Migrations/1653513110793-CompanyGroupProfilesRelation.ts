import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from 'typeorm'

export class CompanyGroupProfilesRelation1653513110793
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('company_group')
    const foreignKeyCompanyGroupProfile = table!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('company_group_profile_id') !== -1
    )
    await queryRunner.dropForeignKey(
      'company_group',
      foreignKeyCompanyGroupProfile!
    )
    await queryRunner.dropColumn('company_group', 'company_group_profile_id')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
        columnNames: ['company_group_profile_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'company_group_profile',
        onDelete: 'NO ACTION'
      })
    )
  }
}
