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

import { RetailGroup } from '@/Domain/RetailGroup/retailGroup.entity'
import { User } from '@/Domain/User/user.entity'

@Entity('user_retails')
export class UserRetail {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id', select: false, type: 'uuid' })
  userId: string

  @Column({ name: 'group_id', select: false, type: 'uuid' })
  groupId: string

  @ManyToOne(() => User, (user) => user.id, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => RetailGroup, (group) => group.id, { eager: true })
  @JoinColumn({ name: 'group_id' })
  group: RetailGroup

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
