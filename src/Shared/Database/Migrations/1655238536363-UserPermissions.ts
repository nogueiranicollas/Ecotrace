import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumnOptions
} from 'typeorm'

export class UserPermissions1655238536363 implements MigrationInterface {
  private tableName = 'user_permissions'

  private columns: TableColumnOptions[] = [
    {
      name: 'user_id',
      type: 'uuid'
    },
    {
      name: 'retail',
      type: 'boolean'
    },
    {
      name: 'provider',
      type: 'boolean'
    },
    {
      name: 'weaving',
      type: 'boolean'
    },
    {
      name: 'wiring',
      type: 'boolean'
    },
    {
      name: 'productive_chain',
      type: 'boolean'
    },
    {
      name: 'traceability_property',
      type: 'boolean'
    },
    {
      name: 'blockchain_history',
      type: 'boolean'
    },
    {
      name: 'users',
      type: 'boolean'
    },
    {
      name: 'industries',
      type: 'boolean'
    },
    {
      name: 'industries_group',
      type: 'boolean'
    },
    {
      name: 'property_register',
      type: 'boolean'
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM user_permissions')
  }
}
