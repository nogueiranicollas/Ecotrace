import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  filename: string

  @Column()
  ext: string

  @Column()
  mime: string

  @Column({ unique: true })
  key: string

  @Column()
  src: string

  @Column({ default: 'local' })
  storage: string

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
