import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { TypeORMTransformers } from '@/Shared/Utils'

import { User } from '@/Domain/User/user.entity'
import { City } from '@/Domain/City/city.entity'
import { Entity as Contact } from '@/Domain/Contact/contact.entity'
import { PropertyProducer } from '@/Domain/PropertyProducers/propertyProducers.entity'
import { PropertyCertifications } from '../PropertyCertifications/propertyCertifications.entity'

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    nullable: false,
    type: 'varchar'
  })
  name: string

  @Column({
    default: '',
    name: 'fancy_name',
    type: 'varchar'
  })
  fancyName: string

  @Column({ default: '', name: 'description', type: 'varchar' })
  description: string

  @Column({
    name: 'CAR',
    nullable: false,
    type: 'varchar'
  })
  CAR: string

  @Column({
    name: 'establishment_code',
    nullable: true,
    type: 'varchar'
  })
  establishmentCode: string

  @Column({
    name: 'INCRA',
    nullable: true,
    type: 'varchar'
  })
  INCRA: string

  @Column({
    name: 'NIRF',
    nullable: true,
    type: 'varchar'
  })
  NIRF: string

  @Column({
    name: 'CCIR',
    nullable: true,
    type: 'varchar'
  })
  CCIR: string

  @Column({
    name: 'perimeter_docs_origin',
    nullable: true,
    type: 'varchar'
  })
  perimeterDocsOrigin: string

  @Column({
    name: 'LAR_LAU',
    nullable: true,
    type: 'varchar'
  })
  LARLAU: string

  @Column({ nullable: true, type: 'float' })
  lat: number

  @Column({ nullable: true, type: 'float' })
  lng: number

  @Column({
    name: 'area',
    nullable: true,
    precision: 2,
    type: 'numeric',
    width: 18
  })
  area: number

  @Column({ name: 'author_id', select: false, type: 'uuid' })
  authorId: string

  @Column({ name: 'address', nullable: true, type: 'varchar' })
  address: string

  @Column({ name: 'biome_id', nullable: true, type: 'uuid' })
  biomeId: string

  @Column({ transformer: TypeORMTransformers.CEP })
  cep: string

  @Column({ name: 'city_id', nullable: true, select: false, type: 'uuid' })
  cityId: string

  // Relations
  @ManyToOne(() => City, (city) => city.id, { eager: true, nullable: true })
  @JoinColumn({ name: 'city_id' })
  city: City

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'author_id' })
  author: User

  @ManyToMany(() => Contact, (contact) => contact.id, {
    eager: true,
    cascade: true
  })
  @JoinTable({ name: 'property_contacts' })
  contacts: Contact[]

  @OneToMany(
    () => PropertyProducer,
    (propertyProducer) => propertyProducer.property
  )
  public producers: PropertyProducer[]

  @OneToMany(
    () => PropertyCertifications,
    (certification) => certification.property,
    {
      nullable: true
    }
  )
  public certifications: PropertyCertifications[]

  // Dates
  @CreateDateColumn({
    name: 'created_at',
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
    type: 'timestamp with time zone'
  })
  updatedAt: Date
}
