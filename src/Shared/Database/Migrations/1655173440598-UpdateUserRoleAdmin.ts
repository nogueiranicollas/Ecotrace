import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUserRoleAdmin1655173440598 implements MigrationInterface {
  // O ID 3797c4ac-1708-4394-9a82-70393e58254b refere-se ao antigo Administrador, que foi removido na migration DeleteAdminGenericUserRole1655173616665
  // O ID 79fb2f32-a68b-4a2c-a7ed-5726b73522c4 refere-se ao Admin Ecotrace que será o "admin master"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `update users set role_id = '79fb2f32-a68b-4a2c-a7ed-5726b73522c4' where role_id = '3797c4ac-1708-4394-9a82-70393e58254b';`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `update users set role_id = '3797c4ac-1708-4394-9a82-70393e58254b' where role_id = '79fb2f32-a68b-4a2c-a7ed-5726b73522c4';`
    )
  }
}
