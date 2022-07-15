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

import { RetailContacts } from '@/Domain/RetailContacts/retailContacts.entity'
import { RetailGroup } from '@/Domain/RetailGroup/retailGroup.entity'
import { TypeORMTransformers } from '@/Shared/Utils'

@Entity('retails')
export class Retail {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  fancyName: string

  @Column({ transformer: TypeORMTransformers.CNPJ })
  cnpj: string

  @Column({ name: 'inspection_type' })
  inspectionType: string

  @Column({ name: 'inspection_num' })
  inspectionNum: string

  @Column()
  ie: string

  @Column({ type: 'boolean' })
  status: boolean

  @Column()
  address: string

  @Column({ length: 2, type: 'char' })
  state: string

  @Column()
  city: string

  @Column({ nullable: true, type: 'float' })
  lat: number

  @Column({ nullable: true, type: 'float' })
  lng: number

  @Column()
  cep: string

  @Column({ transformer: TypeORMTransformers.array, type: 'varchar' })
  qualifications: string[]

  @OneToMany(
    () => RetailContacts,
    contact => contact.retail,
    { cascade: true }
  )
  contacts: RetailContacts[]

  @ManyToMany(
    () => RetailGroup,
    retailGroup => retailGroup.retails
  )
  groups: RetailGroup[]

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
