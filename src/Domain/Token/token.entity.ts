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

import { User } from '@/Domain/User/user.entity'

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  jwt: string

  @Column({ name: 'user_agent' })
  userAgent: string

  @Column({ name: 'ip' })
  IP: string

  @Column({ name: 'bearer_id', select: false, type: 'uuid' })
  bearerId: string

  @ManyToOne(() => User, (user) => user.id, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'bearer_id' })
  bearer: User

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
