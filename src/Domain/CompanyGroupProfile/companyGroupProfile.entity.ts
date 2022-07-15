import {
  CreateDateColumn,
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany
} from 'typeorm'
import { CompanyGroup } from '../CompanyGroup/companyGroup.entity'

@Entity('company_group_profile')
export class CompanyGroupProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  description: string

  @Column()
  tag: string

  @ManyToMany(
    () => CompanyGroup,
    (companyGroup) => companyGroup.companyGroupProfiles
  )
  companyGroups: CompanyGroup[]

  @DeleteDateColumn({
    name: 'deleted_at',
    select: false,
    type: 'timestamp with time zone'
  })
  deletedAt: Date | null

  @CreateDateColumn({
    name: 'created_at',
    select: false,
    type: 'timestamp with time zone'
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    select: false,
    type: 'timestamp with time zone'
  })
  updatedAt: Date
}
