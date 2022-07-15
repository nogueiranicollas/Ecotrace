import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions'
import { Biome } from '@/Domain/Biomes/biomes.entity'

export class CreateBiomes1653397166619 implements MigrationInterface {
  private seeds: Pick<Biome, 'id' | 'biome' | 'tag'>[] = [
    {
      id: 'b9bb24d7-971b-472f-9c98-4999273321fc',
      biome: 'Amazônia',
      tag: 'amazonia'
    },
    {
      id: '441895ac-049c-4707-9dc1-4e35a875ecc9',
      biome: 'Caatinga',
      tag: 'caatinga'
    },
    {
      id: '3b2c8ee0-9352-47d0-bf24-d4758681c8d0',
      biome: 'Cerrado',
      tag: 'cerrado'
    },
    {
      id: '3261eaa4-44b0-4832-8d7f-a38475650920',
      biome: 'Pantanal',
      tag: 'pantanal'
    },
    {
      id: 'f0639498-a68d-4f19-a099-487999c046b1',
      biome: 'Mata Atlântica',
      tag: 'mataAtlantica'
    },
    { id: 'f82152e1-08d1-43d5-adc1-8349d7e26d95', biome: 'Pampa', tag: 'pampa' }
  ]

  private tableName = 'biomes'
  private columns: TableColumnOptions[] = [
    {
      isPrimary: true,
      name: 'id',
      type: 'uuid'
    },
    {
      isNullable: false,
      name: 'biome',
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
          .into(this.tableName)
          .values(seed)
          .execute()
      )
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM biomes')
  }
}
