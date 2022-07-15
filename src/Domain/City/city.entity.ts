import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { GeoPoint } from '@/Shared/Utils'
@Entity('cities')
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'codigo_ibge', nullable: false, type: 'varchar' })
  codeIBGE: string

  @Column({ name: 'nome', nullable: false, type: 'varchar' })
  name: string

  @Column({ name: 'capital', nullable: false, type: 'boolean' })
  capital: boolean

  @Column({ name: 'geo', nullable: false, type: 'point' })
  geo: GeoPoint

  @Column({ name: 'siafi_id', nullable: false, type: 'varchar' })
  siafiId: string

  @Column({ name: 'ddd', nullable: false, type: 'numeric' })
  ddd: number

  @Column({ name: 'fuso_horario', nullable: false, type: 'varchar' })
  fusoHorario: string

  @Column({ name: 'uf', nullable: false, type: 'varchar' })
  uf: string

  @Column({ name: 'uf_nome', nullable: false, type: 'varchar' })
  ufNome: string

  @Column({ name: 'uf_codigo', nullable: false, type: 'numeric' })
  ufCodigo: number

  @Column({ name: 'uf_geo', nullable: false, type: 'point' })
  ufGeo: GeoPoint
}
