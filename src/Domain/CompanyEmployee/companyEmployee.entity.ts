import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { Company } from '@/Domain/Company/company.entity'
import { Employee } from '@/Domain/Employee/employee.entity'

@Entity('company_employees')
export class CompanyEmployee {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'employee_id', select: false, type: 'uuid' })
  employeeId: string

  @Column({ name: 'company_id', select: false, type: 'uuid' })
  companyId: string

  @Column({ enum: ['manager', 'technician'], type: 'varchar' })
  role: string

  @Column({
    default: () => 'NOW()',
    name: 'admitted_at',
    type: 'timestamp with time zone'
  })
  admittedAt: Date

  @Column({
    name: 'exited_at',
    nullable: true,
    type: 'timestamp with time zone'
  })
  @Index()
  exitedAt: Date | null

  @ManyToOne(
    () => Employee,
    employee => employee.id,
    { eager: true }
  )
  @JoinColumn({ name: 'employee_id' })
  employee: Employee

  @ManyToOne(
    () => Company,
    company => company.id
  )
  @JoinColumn({ name: 'company_id' })
  company: Company

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
