import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { Retail } from '@/Domain/Retail/retail.entity'

@Entity('retail_group')
export class RetailGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @Index()
  name: string

  @Column({ name: 'admin_name' })
  adminName: string

  @Column({ name: 'admin_email' })
  @Index()
  adminEmail: string

  @Column({ default: true })
  visible: boolean

  @ManyToMany(() => Retail, (retail) => retail.groups)
  @JoinTable({
    name: 'retail_group_retails',
    joinColumn: { name: 'retail_group_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'retail_id', referencedColumnName: 'id' }
  })
  retails: Retail[]

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
