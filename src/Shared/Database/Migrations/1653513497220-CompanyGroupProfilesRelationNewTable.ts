import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CompanyGroupProfilesRelationNewTable1653513497220
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'company_group_profiles',
        columns: [
          {
            name: 'company_group_profile_id',
            type: 'varchar',
            isPrimary: true
          },
          {
            name: 'company_group_id',
            type: 'uuid',
            isPrimary: true
          }
        ],
        foreignKeys: [
          {
            columnNames: ['company_group_profile_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'company_group_profile'
          },
          {
            columnNames: ['company_group_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'company_group'
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('company_group_profiles')
  }
}
