import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm'

@Entity('user_permissions')
@Index(['userId'])
@Unique(['userId'])
export class UserPermissions {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string

  @Column()
  retail: boolean

  @Column()
  provider: boolean

  @Column()
  weaving: boolean

  @Column()
  wiring: boolean

  @Column({ name: 'productive_chain' })
  productiveChain: boolean

  @Column({ name: 'traceability_property' })
  traceabilityProperty: boolean

  @Column({ name: 'blockchain_history' })
  blockchainHistory: boolean

  @Column()
  users: boolean

  @Column()
  industries: boolean

  @Column({ name: 'industries_group' })
  industriesGroup: boolean

  @Column({ name: 'property_register' })
  propertyRegister: boolean

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
