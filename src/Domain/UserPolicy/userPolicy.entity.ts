import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { UserRole } from '@/Domain/UserRole/userRole.entity'

@Entity('user_policies')
export class UserPolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  description: string

  @Column()
  object: string

  @Column({ name: 'role_id', select: false, type: 'uuid' })
  roleId

  @ManyToOne(
    () => UserRole,
    role => role.id
  )
  @JoinColumn({ name: 'role_id' })
  role: UserRole

  @CreateDateColumn({
    name: 'created_at',
    select: false,
    type: 'timestamp with time zone'
  })
  createdAt: Date

  @DeleteDateColumn({
    name: 'deleted_at',
    select: false,
    type: 'timestamp with time zone'
  })
  deletedAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    select: false,
    type: 'timestamp with time zone'
  })
  updatedAt: Date
}
