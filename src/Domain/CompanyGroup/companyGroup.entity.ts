import {
  CreateDateColumn,
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'

import { Company } from '@/Domain/Company/company.entity'
import { TypeORMTransformers } from '@/Shared/Utils'
import { User } from '../User/user.entity'
import { CompanyGroupRole } from '../CompanyGroupRole/companyGroupRole.entity'
import { CompanyGroupProfile } from '../CompanyGroupProfile/companyGroupProfile.entity'

@Entity('company_group')
export class CompanyGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ name: 'admin_email' })
  @Index()
  adminEmail: string

  @Column({ name: 'admin_name' })
  adminName: string

  @Column({
    transformer: TypeORMTransformers.CNPJ,
    type: 'varchar'
  })
  cnpj: string

  @Column()
  visible: boolean

  @Column({ name: 'company_group_role_id', select: false, type: 'uuid' })
  companyGroupRoleId: string

  // @Column({ name: 'company_group_profile_id', select: false, type: 'uuid' })
  // companyGroupProfileId: string

  @Column({ name: 'data_source', nullable: true, select: false, type: 'json' })
  dataSource: Record<string, any>

  @ManyToOne(
    () => CompanyGroupRole,
    (companyGroupRole) => companyGroupRole.companyGroups
  )
  @JoinColumn({ name: 'company_group_role_id' })
  companyGroupRole: CompanyGroupRole

  @ManyToMany(
    () => CompanyGroupProfile,
    (companyGroupProfile) => companyGroupProfile.companyGroups,
    { cascade: true }
  )
  @JoinTable({
    name: 'company_group_profiles',
    joinColumn: { name: 'company_group_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'company_group_profile_id',
      referencedColumnName: 'id'
    }
  })
  companyGroupProfiles: CompanyGroupProfile[]

  @ManyToMany(() => Company, (company) => company.groups)
  @JoinTable({
    name: 'company_group_companies',
    joinColumn: { name: 'company_group_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'company_id', referencedColumnName: 'id' }
  })
  companies: Company[]

  @ManyToMany(() => User, (user) => user.companiesGroups)
  users: User[]

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
