import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions'
import { Language } from '@/Domain/Language/language.entity'

export class CreateLanguages1651671013440 implements MigrationInterface {
  private seeds: Pick<Language, 'id' | 'language' | 'tag' | 'flag'>[] = [
    {
      id: '81e58ad5-b2c0-43ea-a54f-a0a564615b66',
      language: 'Português - BR',
      tag: 'pt-BR',
      flag: 'brazil'
    },
    {
      id: '5f33eea5-386a-4e41-835c-831720f812c3',
      language: 'English - EN',
      tag: 'en-US',
      flag: 'england'
    },
    {
      id: 'e1dc012c-24d9-4ce7-9e13-eeab4485b8f2',
      language: 'Español - ES',
      tag: 'es',
      flag: 'spain'
    },
    {
      id: 'c86a76ca-8585-46b0-ba60-0ba7dad1c722',
      language: '中文 - ZH - CN',
      tag: '中文 - ZH - CN',
      flag: 'china'
    }
  ]

  private tableName = 'languages'
  private columns: TableColumnOptions[] = [
    {
      isPrimary: true,
      name: 'id',
      type: 'uuid'
    },
    {
      isNullable: false,
      name: 'language',
      type: 'varchar'
    },
    {
      isNullable: true,
      name: 'flag',
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
          .into('languages')
          .values(seed)
          .execute()
      )
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM languages')
  }
}
