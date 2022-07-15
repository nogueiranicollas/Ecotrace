import { UserRole } from '@/Domain/UserRole/userRole.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class DeleteAdminGenericUserRole1655173616665
  implements MigrationInterface
{
  private oldAdminRole: Pick<UserRole, 'id' | 'description' | 'tag'> = {
    id: '3797c4ac-1708-4394-9a82-70393e58254b',
    description: 'Administrador',
    tag: 'admin'
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `delete from user_roles where id = '3797c4ac-1708-4394-9a82-70393e58254b';`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('company_group_role')
      .values(this.oldAdminRole)
      .execute()
  }
}
