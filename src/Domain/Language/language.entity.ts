import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm'

@Entity('languages')
@Index(['tag'])
@Unique(['tag'])
export class Language {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  language: string

  @Column()
  tag: string

  @Column({ nullable: true })
  flag: string

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
