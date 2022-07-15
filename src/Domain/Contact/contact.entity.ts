import {
  Column,
  CreateDateColumn,
  Entity as _Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { User } from '@/Domain/User/user.entity'
import { TypeORMTransformers } from '@/Shared/Utils'

@_Entity('contacts')
export class Entity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    nullable: false,
    type: 'varchar'
  })
  name: string

  @Column({ nullable: false, type: 'varchar' })
  email: string

  @Column({ transformer: TypeORMTransformers.phone })
  phone: string

  @Column({ nullable: true, type: 'varchar' })
  position: string

  @Column({ name: 'author_id', type: 'uuid' })
  authorId: string

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'author_id' })
  author: User

  @CreateDateColumn({
    name: 'created_at',
    select: false,
    type: 'timestamp with time zone'
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    select: false,
    type: 'timestamp with time zone'
  })
  updatedAt: Date
}
