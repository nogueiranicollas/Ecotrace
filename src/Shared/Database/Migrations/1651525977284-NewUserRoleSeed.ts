import { MigrationInterface, QueryRunner } from 'typeorm'

import { UserRole } from '@/Domain/UserRole/userRole.entity'

export class NewUserRoleSeed1651525977284 implements MigrationInterface {
  private seeds: Pick<UserRole, 'id' | 'description' | 'tag' | 'polices'>[] = [
    {
      id: '79fb2f32-a68b-4a2c-a7ed-5726b73522c4',
      description: 'ADM Ecotrace',
      tag: 'admeco',
      polices: []
    },
    {
      id: '6b795f64-081a-4985-adfb-a174aac848c4',
      description: 'ADM Industria',
      tag: 'admind',
      polices: []
    },
    {
      id: 'fad726f6-dc91-4927-bf67-9180b4f779bc',
      description: 'Visualizador',
      tag: 'visual',
      polices: []
    }
  ]

  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      this.seeds.map((seed) =>
        queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(UserRole)
          .values(seed)
          .execute()
      )
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM user_roles')
  }
}
