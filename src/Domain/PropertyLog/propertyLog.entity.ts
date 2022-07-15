import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm'

import { Property } from '@/Domain/Properties/property.entity'
import { User } from '@/Domain/User/user.entity'
import { Producer } from '@/Domain/Producer/producer.entity'

@Entity('property_log')
export class PropertyLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'action', nullable: false, type: 'varchar' })
  action: string

  @Column({ name: 'log', nullable: false, type: 'jsonb' })
  log: string

  @Column({ name: 'author_id', nullable: false, type: 'uuid' })
  authorId: string

  @Column({ name: 'property_id', nullable: false, type: 'uuid' })
  propertyId: string

  @Column({ name: 'producer_id', nullable: false, type: 'uuid' })
  producerId: string

  // Relations
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'author_id' })
  author: User

  @ManyToOne(() => Property, (property) => property.id)
  @JoinColumn({ name: 'property_id' })
  property: Property

  @ManyToOne(() => Producer, (producer) => producer.id)
  @JoinColumn({ name: 'producer_id' })
  producer: Producer

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
