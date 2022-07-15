import { CompanyGroupProfile } from '@/Domain/CompanyGroupProfile/companyGroupProfile.entity'
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumnOptions
} from 'typeorm'

export class CompanyGroupProfileSeeds1652401922559
  implements MigrationInterface
{
  private seeds: Pick<CompanyGroupProfile, 'id' | 'description' | 'tag'>[] = [
    {
      id: 'ab442c58-eda3-4023-b885-37b29dfeeb4f',
      description: 'Varejo',
      tag: 'var'
    },
    {
      id: '0a7d7aff-90ba-40f2-81bb-ae74320fe5d9',
      description: 'Loja',
      tag: 'loj'
    },
    {
      id: '9cb26df2-ae8e-4885-b6f4-537a38cb3472',
      description: 'Fornecedor',
      tag: 'for'
    },
    {
      id: 'dfb500ae-d87f-4eb8-bc2c-27c2324b7671',
      description: 'Subcontratados',
      tag: 'sub'
    },
    {
      id: '8333b006-55f6-46d6-96dd-58cf1ea0b950',
      description: 'Tecelagem',
      tag: 'tec'
    },
    {
      id: 'b08f5e24-d06b-49d1-bdd9-38c612c02c85',
      description: 'Malharia',
      tag: 'mal'
    },
    {
      id: '81fd9dcb-25aa-4c70-a899-225ee880e637',
      description: 'Fiação',
      tag: 'fia'
    }
  ]

  private tableName = 'company_group_profile'

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
          .into('company_group_profile')
          .values(seed)
          .execute()
      )
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM company_group_profile')
  }
}
