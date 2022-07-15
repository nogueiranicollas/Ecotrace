import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from 'typeorm'

export class AddLanguageToUser1653577016853 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'language_id',
        type: 'uuid',
        default: "'81e58ad5-b2c0-43ea-a54f-a0a564615b66'"
      })
    )

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['language_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'languages',
        onDelete: 'NO ACTION'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users')
    const foreignKeyLanguage = table!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('language_id') !== -1
    )
    await queryRunner.dropForeignKey('users', foreignKeyLanguage!)
    await queryRunner.dropColumn('users', 'language_id')
  }
}
