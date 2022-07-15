import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { TypeORMTransformers } from '@/Shared/Utils'

import { CompanyContacts } from '@/Domain/CompanyContacts/companyContacts.entity'
import { CompanyEmployee } from '@/Domain/CompanyEmployee/companyEmployee.entity'
import { CompanyGroup } from '@/Domain/CompanyGroup/companyGroup.entity'
import { CompanyPhotos } from '@/Domain/CompanyPhotos/companyPhotos.entity'
import { CompanyCertifications } from '../CompanyCertifications/companyCertifications.entity'

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  address: string

  @Column()
  city: string

  @Column({ transformer: TypeORMTransformers.CNPJ })
  cnpj: string

  @Column({ transformer: TypeORMTransformers.CEP })
  cep: string

  @Column({ name: 'fancy_name' })
  fancyName: string

  @Column()
  ie: string

  @Column()
  name: string

  @Column({ type: 'varchar', nullable: true })
  country: string

  @Column({ length: 2, type: 'char' })
  state: string

  @Column({ type: 'varchar', nullable: true })
  microregion: string

  @Column({ nullable: true, type: 'float' })
  lat: number

  @Column({ nullable: true, type: 'float' })
  lng: number

  @Column({ default: true })
  status: boolean

  @Column({ transformer: TypeORMTransformers.array, type: 'varchar' })
  qualifications: string[]

  @ManyToMany(() => CompanyGroup, (companyGroup) => companyGroup.companies)
  groups: CompanyGroup[]

  @OneToMany(() => CompanyContacts, (contact) => contact.company, {
    nullable: true
  })
  contacts: CompanyContacts[]

  @OneToMany(
    () => CompanyCertifications,
    (certification) => certification.company,
    {
      nullable: true
    }
  )
  certifications: CompanyCertifications[]

  @OneToMany(
    () => CompanyEmployee,
    (companyEmployee) => companyEmployee.company,
    { nullable: true }
  )
  employees: CompanyEmployee[]

  @OneToMany(() => CompanyPhotos, (photo) => photo.company, { nullable: true })
  photos: CompanyPhotos[]

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
  deletedAt: Date | null

  @UpdateDateColumn({
    name: 'updated_at',
    select: false,
    type: 'timestamp with time zone'
  })
  updatedAt: Date
}
