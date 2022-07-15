import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { File } from '@/Domain/File/file.entity'

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  @Index()
  doc: string

  @Column()
  bio: string

  @Column({ name: 'photo_id', nullable: true, select: false, type: 'uuid' })
  photoId: string

  @OneToOne(
    () => File,
    file => file.id,
    { cascade: true, eager: true, nullable: true }
  )
  @JoinColumn({ name: 'photo_id' })
  photo: File

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
