import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { TypeORMTransformers } from '@/Shared/Utils'
import { Property } from '../Properties/property.entity'

@Entity('property_certifications')
export class PropertyCertifications {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'property_id', select: false, type: 'uuid' })
  propertyId: string

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

  @ManyToOne(() => Property, (property) => property.certifications)
  @JoinColumn({ name: 'property_id' })
  property: Property

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
