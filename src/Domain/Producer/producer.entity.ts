import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  Unique
} from 'typeorm'

import { TypeORMTransformers } from '@/Shared/Utils'

import { User } from '@/Domain/User/user.entity'
import { PropertyProducer } from '@/Domain/PropertyProducers/propertyProducers.entity'

@Entity('producers')
@Unique(['CPFCNPJ', 'IE'])
export class Producer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    nullable: false,
    type: 'varchar'
  })
  name: string

  @Column({
    name: 'CPFCNPJ',
    transformer: TypeORMTransformers.CPFCNPJ,
    type: 'varchar'
  })
  @Index()
  CPFCNPJ: string

  @Column({
    name: 'IE',
    transformer: TypeORMTransformers.isento,
    type: 'varchar'
  })
  IE: string

  @Column({
    name: 'establishment_code',
    nullable: true,
    type: 'varchar'
  })
  establishmentCode: string

  @Column({
    name: 'livestock_exploitation_code',
    nullable: true,
    type: 'varchar'
  })
  livestockExploitationCode: string

  @Column({
    name: 'ref_insert',
    nullable: false,
    transformer: TypeORMTransformers.isento,
    type: 'varchar'
  })
  REF: string

  // Relations
  @Column({ name: 'author_id', nullable: false, select: false, type: 'uuid' })
  authorId: string

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'author_id' })
  author: User

  @OneToMany(
    () => PropertyProducer,
    (propertyProducer) => propertyProducer.producer
  )
  properties: PropertyProducer[]

  // Dates
  @CreateDateColumn({
    name: 'created_at',
    select: true,
    type: 'timestamp with time zone'
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    select: true,
    type: 'timestamp with time zone'
  })
  updatedAt: Date
}
