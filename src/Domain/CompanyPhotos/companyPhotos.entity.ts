import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { Company } from '@/Domain/Company/company.entity'
import { File } from '@/Domain/File/file.entity'

@Entity('company_photos')
export class CompanyPhotos {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'company_id', select: false, type: 'uuid' })
  companyId: string

  @Column({ name: 'file_id', select: false, type: 'uuid' })
  fileId: string

  @OneToOne(
    () => File,
    file => file.id,
    { cascade: true, eager: true }
  )
  @JoinColumn({ name: 'file_id' })
  file: File

  @ManyToOne(
    () => Company,
    company => company.id
  )
  @JoinColumn({ name: 'company_id' })
  company: Company

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
