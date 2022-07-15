import {
  CreateDateColumn,
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  AfterLoad,
  OneToOne,
  ManyToMany,
  JoinTable
} from 'typeorm'

import { File } from '@/Domain/File/file.entity'
import { UserRole } from '@/Domain/UserRole/userRole.entity'
import { UserCompany } from '@/Domain/UserCompany/userCompany.entity'
import { UserRetail } from '@/Domain/UserRetail/userRetail.entity'

import { TypeORMTransformers } from '@/Shared/Utils'
import { Language } from '../Language/language.entity'
import { CompanyGroup } from '../CompanyGroup/companyGroup.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ transformer: TypeORMTransformers.CPF })
  CPF: string

  @Column()
  email: string

  @Column({ name: 'email_recovery', nullable: true, type: 'varchar' })
  emailRecovery: string | null

  @Column({ transformer: TypeORMTransformers.phone })
  phone: string

  @Column({
    name: 'phone_recovery',
    nullable: true,
    transformer: TypeORMTransformers.phone,
    type: 'varchar'
  })
  phoneRecovery: string | null

  @Column()
  pwd: string

  @Column({ name: 'language_id', type: 'uuid' })
  languageId: string

  @Column()
  department: string

  @Column({
    name: 'last_signin',
    nullable: true,
    type: 'timestamp with time zone'
  })
  lastSignIn: Date | null

  @Column({ name: 'pwd_recovery_token', nullable: true, type: 'varchar' })
  pwdRecoveryToken: string | null

  @Column({ name: 'avatar_id', nullable: true, select: false, type: 'uuid' })
  avatarId: string

  @Column({ name: 'role_id', select: false, type: 'uuid' })
  roleId: string

  @OneToOne(() => File, (file) => file.id, {
    cascade: true,
    nullable: true,
    persistence: false
  })
  @JoinColumn({ name: 'avatar_id' })
  avatar: File

  @ManyToOne(() => UserRole, (role) => role.id, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: UserRole

  @ManyToOne(() => Language, (language) => language.id, {
    eager: true,
    nullable: true
  })
  @JoinColumn({ name: 'language_id' })
  language: Language

  @OneToMany(() => UserCompany, (userCompany) => userCompany.user, {
    eager: true
  })
  _companies: UserCompany[]

  @OneToMany(() => UserRetail, (userRetail) => userRetail.user, { eager: true })
  _retails: UserRetail[]

  @CreateDateColumn({
    name: 'created_at',
    select: false,
    type: 'timestamp with time zone'
  })
  createdAt: Date

  @ManyToMany(() => CompanyGroup, (companyGroup) => companyGroup.users)
  @JoinTable({
    name: 'user_companies_groups',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'company_group_id', referencedColumnName: 'id' }
  })
  companiesGroups: CompanyGroup[]

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

  name: string

  @AfterLoad()
  computed() {
    this.name = `${this.firstName} ${this.lastName}`
  }
}
