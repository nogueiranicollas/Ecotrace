import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('apps')
export class App {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  @Index()
  URL: string

  @Column({ unique: true })
  @Index()
  tag: string

  @Column({ default: false, name: 'is_active' })
  @Index()
  isActive: boolean
}
