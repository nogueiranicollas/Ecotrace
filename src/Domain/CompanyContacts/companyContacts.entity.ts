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
import { Company } from '../Company/company.entity'

@Entity('company_contacts')
export class CompanyContacts {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'company_id', select: false, type: 'uuid' })
  companyId: string

  @Column()
  name: string

  @Column({ transformer: TypeORMTransformers.phone })
  phone: string

  @Column()
  email: string

  @ManyToOne(
    () => Company,
    company => company.contacts
  )
  @JoinColumn({ name: 'company_id' })
  company: Company

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
