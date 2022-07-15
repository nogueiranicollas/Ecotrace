import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumnOptions
} from 'typeorm'

import { CompanyGroupRole } from '@/Domain/CompanyGroupRole/companyGroupRole.entity'

export class CompanyGroupRoleSeeds1652362081662 implements MigrationInterface {
  private seeds: Pick<CompanyGroupRole, 'id' | 'description' | 'tag'>[] = [
    {
      id: '98642092-20ae-4f6e-9ba0-29040dae22b8',
      description: 'Liberação de acesso',
      tag: 'aclib'
    },
    {
      id: '44a4b19b-54ab-4e18-8ed0-80dd261d4472',
      description: 'Configuração de filtro',
      tag: 'filconfig'
    }
  ]

  private tableName = 'company_group_role'

  private columns: TableColumnOptions[] = [
    {
      isPrimary: true,
      name: 'id',
      type: 'varchar'
    },
    {
      isNullable: false,
      name: 'description',
      type: 'varchar'
    },
    {
      isNullable: false,
      name: 'tag',
      type: 'varchar'
    },
    {
      default: 'now()',
      name: 'created_at',
      type: 'timestamp with time zone'
    },
    {
      default: 'now()',
      name: 'updated_at',
      type: 'timestamp with time zone'
    },
    {
      isNullable: true,
      name: 'deleted_at',
      type: 'timestamp with time zone'
    }
  ]

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: this.columns
      })
    )

    await Promise.all(
      this.seeds.map((seed) =>
        queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into('company_group_role')
          .values(seed)
          .execute()
      )
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM company_group_role')
  }
}
