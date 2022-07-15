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

import { CompanyGroup } from '@/Domain/CompanyGroup/companyGroup.entity'
import { User } from '@/Domain/User/user.entity'

@Entity('user_companies')
export class UserCompany {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id', select: false, type: 'uuid' })
  userId: string

  @Column({ name: 'group_id', select: false, type: 'uuid' })
  groupId: string

  @ManyToOne(() => CompanyGroup, (group) => group.id, { eager: true })
  @JoinColumn({ name: 'group_id' })
  group: CompanyGroup

  @ManyToOne(() => User, (user) => user._companies, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column()
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
