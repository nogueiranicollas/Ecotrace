import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  Unique
} from 'typeorm'
import { Property } from '@/Domain/Properties/property.entity'
import { Producer } from '@/Domain/Producer/producer.entity'

@Entity('property_producers')
@Unique(['propertyId', 'producerId'])
export class PropertyProducer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  public propertyId: string

  @Column('uuid')
  public producerId: string

  @Column({
    name: 'block_status',
    default: false,
    type: 'boolean'
  })
  blockStatus: boolean

  @Column({ name: 'reason', nullable: true, type: 'varchar' })
  reason: string

  @ManyToOne(() => Property, (property) => property.producers)
  public property: Property

  @ManyToOne(() => Producer, (producer) => producer.properties)
  public producer: Producer

  @DeleteDateColumn({
    name: 'deleted_at',
    select: false,
    type: 'timestamp with time zone'
  })
  deletedAt: Date
}
