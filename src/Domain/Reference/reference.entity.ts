import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn
} from 'typeorm'

import { TypeORMTransformers } from '@/Shared/Utils'

import { City } from '@/Domain/City/city.entity'

@Entity('reference')
export class Reference {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    name: 'name_producer',
    nullable: false,
    type: 'varchar'
  })
  nameProducer: string

  @Column({
    name: 'CPFCNPJ',
    nullable: false,
    transformer: TypeORMTransformers.CPFCNPJ,
    type: 'varchar'
  })
  CPFCNPJ: string

  @Column({
    name: 'IE',
    nullable: false,
    transformer: TypeORMTransformers.isento,
    type: 'varchar'
  })
  IE: string

  @Column({
    name: 'key_insert',
    nullable: false,
    type: 'varchar'
  })
  keyInsert: string

  @Column({
    name: 'name_property',
    nullable: false,
    type: 'varchar'
  })
  nameProperty: string

  @Column({ default: '', type: 'varchar' })
  description: string

  @Column({
    name: 'CAR',
    type: 'varchar'
  })
  CAR: string

  @Column({
    name: 'establishment_code',
    type: 'varchar'
  })
  establishmentCode: string

  @Column({
    name: 'livestock_exploitation_code',
    type: 'varchar'
  })
  livestockExploitationCode: string

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
    name: 'LAR_LAU',
    nullable: true,
    type: 'varchar'
  })
  LARLAU: string

  @Column({
    name: 'perimeter_docs_origin',
    nullable: true,
    type: 'varchar'
  })
  perimeterDocsOrigin: string

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

  @Column({ name: 'zip_code', nullable: true, type: 'varchar' })
  zipCode: string

  @Column({ name: 'address', nullable: true, type: 'varchar' })
  address: string

  @Column({ name: 'street_number', nullable: true, type: 'varchar' })
  streetNumber: string

  @Column({ name: 'complement', nullable: true, type: 'varchar' })
  complement: string

  @Column({ name: 'city_name', nullable: true, type: 'varchar' })
  cityName: string

  @Column({ name: 'state_name', nullable: true, type: 'varchar' })
  stateName: string

  @Column({ name: 'flag_status', nullable: true, type: 'boolean' })
  flagStatus: boolean

  @Column({ name: 'type_operation', nullable: true, type: 'varchar' })
  typeOperation: string

  @Column({ name: 'log', nullable: true, type: 'varchar' })
  log: string

  @Column({ name: 'city_id', nullable: true, select: false, type: 'uuid' })
  cityId: string

  // Relations
  @ManyToOne(() => City, (city) => city.id, { eager: true, nullable: true })
  @JoinColumn({ name: 'city_id' })
  city: City

  // Dates
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone'
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone'
  })
  updatedAt: Date
}
