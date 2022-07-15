import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from 'typeorm'

export class PropiertyNewBiomeId1654528413837 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'properties',
      new TableColumn({
        name: 'biome_id',
        type: 'uuid',
        default: `'b9bb24d7-971b-472f-9c98-4999273321fc'`
      })
    )

    await queryRunner.createForeignKey(
      'properties',
      new TableForeignKey({
        columnNames: ['biome_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'biomes',
        onDelete: 'NO ACTION'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('properties', 'biome_id')
  }
}
