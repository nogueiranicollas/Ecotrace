import { MigrationInterface, QueryRunner } from 'typeorm'

export class InsertUserPermissionForAllUsers1655238596665
  implements MigrationInterface
{
  private usersAlreadyWithPermissions: { id: string }[]
  private usersWithoutUserPermission: { id: string }[]

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.usersAlreadyWithPermissions = await queryRunner.query(
      `select u.id from users u inner join user_permissions up on up.user_id = u.id;`
    )

    const insertQuery = async (userId: string) => {
      await queryRunner.query(`
      INSERT INTO user_permissions
      (user_id, retail, provider, weaving, wiring, productive_chain, traceability_property, blockchain_history, users, industries, industries_group, property_register, deleted_at)
      VALUES('${userId}', false, false, false, false, false, false, false, false, false, false, false, null);
      `)
    }

    this.usersWithoutUserPermission = await queryRunner.query(
      `select u.id from users u inner join user_permissions up on up.user_id <> u.id;`
    )

    for (const user of this.usersWithoutUserPermission) {
      await insertQuery(user.id)
    }

    if (!this.usersWithoutUserPermission.length) {
      const usersId = await queryRunner.query(`select u.id from users u;`)

      for (const user of usersId) {
        await insertQuery(user.id)
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const user of this.usersWithoutUserPermission) {
      await queryRunner.query(
        `delete from user_permissions where user_id = '${user.id}'`
      )
    }
  }
}
