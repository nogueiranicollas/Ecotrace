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

import { TypeORMTransformers } from '@/Shared/Utils'

import { Retail } from '@/Domain/Retail/retail.entity'

@Entity('retail_contacts')
export class RetailContacts {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column({ transformer: TypeORMTransformers.phone })
  phone: string

  @Column({ name: 'retail_id', select: false, type: 'uuid' })
  retailId: string

  @ManyToOne(
    () => Retail,
    retail => retail.contacts
  )
  @JoinColumn({ name: 'retail_id' })
  retail: Retail

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
