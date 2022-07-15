import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CompanyGroupUserRelation1653576094923
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_companies_groups',
        columns: [
          {
            name: 'user_id',
            type: 'uuid',
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
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users'
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
    await queryRunner.dropTable('user_companies_groups')
  }
}
