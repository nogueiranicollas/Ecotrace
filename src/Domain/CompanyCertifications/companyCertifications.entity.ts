import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { TypeORMTransformers } from '@/Shared/Utils'
import { Company } from '../Company/company.entity'

@Entity('company_certifications')
export class CompanyCertifications {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'company_id', select: false, type: 'uuid' })
  companyId: string

  @Column({ name: 'certification_name', nullable: false })
  name: string

  @Column({ name: 'certification_number', nullable: true })
  number: string

  @Column({ name: 'certification_acronym', nullable: false })
  acronym: string

  @Column({ name: 'corporate_name', nullable: false })
  corporateName: string

  @Column({ transformer: TypeORMTransformers.CNPJ })
  cnpjCert: string

  @ManyToOne(() => Company, (company) => company.certifications)
  @JoinColumn({ name: 'company_id' })
  company: Company

  @Column({
    name: 'issuance_date',
    nullable: true
  })
  issuanceDate: string

  @Column({
    name: 'expiration_date',
    nullable: true
  })
  expirationDate: string
}
