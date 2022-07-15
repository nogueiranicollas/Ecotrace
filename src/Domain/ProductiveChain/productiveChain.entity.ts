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


@Entity('properties')
export class ProductiveChain {
  @PrimaryGeneratedColumn('uuid')
  id: string

  
}

export class OrderSummary {
  @PrimaryGeneratedColumn('uuid')
  id_pedido: string

  @Column({ type: 'varchar', length: 255 })
  orderNumber: string

  @Column({ type: 'date'})
  orderDate: Date

  @Column({ type: 'varchar', length: 255 })
  supplierCnpj: string

  @Column({ type: 'varchar', length: 255 })
  supplierName: string

  orderItens: OrderItem[]
}

export class OrderItem {
  @Column({ type: 'varchar', length: 255 })
  itemCode: string

  @Column({ type: 'varchar', length: 255 })
  itemDescription: string

  @Column({ type: 'int' })
  itemQtyTotal: number

  @Column({ type: 'int' })
  itemQtyDelivered: number
}
