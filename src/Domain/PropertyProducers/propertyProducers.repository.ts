import {
  EntityRepository,
  FindConditions,
  getRepository,
  Repository as _Repository
} from 'typeorm'
import { omit } from 'lodash'

import { AppError } from '@/Shared/Protocols'
import { $errors, getTypeORMCustomRepo, QueryUtil } from '@/Shared/Utils'

import { Property } from '@/Domain/Properties/property.entity'
import { Producer } from '@/Domain/Producer/producer.entity'
import { PropertyProducer } from './propertyProducers.entity'

type PropertyProducerQuery =
  | FindConditions<PropertyProducer>
  | FindConditions<PropertyProducer>[]

export type PropertyProducerPayload = Omit<
  PropertyProducer,
  'id' | 'createdAt' | 'updatedAt'
>

interface PropertyProducerRepo extends _Repository<PropertyProducer> {}

@EntityRepository(PropertyProducer)
class TypeORMRepo
  extends _Repository<PropertyProducer>
  implements PropertyProducerRepo {}

export class Repository {
  private $getRepo: () => PropertyProducerRepo

  private $query: QueryUtil

  constructor({
    repo = getTypeORMCustomRepo<PropertyProducerRepo>(TypeORMRepo),
    $Query = QueryUtil
  } = {}) {
    this.$getRepo = repo

    this.$query = new $Query()
  }

  public async find({ limit, page, column, direction }, query = {} as any) {
    const where = this.$query.handle(
      omit(query, ['CAR', 'name', 'CPFCNPJ', 'producer', 'state'])
    )

    if (query.blockStatus === false) {
      where.blockStatus = query.blockStatus
    }

    const repo = this.$getRepo()

    let command = repo
      .createQueryBuilder('propertyProducer')
      .leftJoinAndSelect('propertyProducer.property', 'property')
      .leftJoinAndSelect('propertyProducer.producer', 'producer')
      .leftJoinAndSelect('property.city', 'cities')
      .leftJoinAndSelect('property.certifications', 'certifications')
      .where(where)

    if (query.CPFCNPJ) {
      command = command.andWhere('producer.CPFCNPJ = :cpfcnpj', {
        cpfcnpj: query.CPFCNPJ.replace(/\D/g, '')
      })
    }
    if (query.state) {
      command = command.andWhere('cities.uf = :state', {
        state: query.state
      })
    }
    if (query.producer) {
      command = command.andWhere('producer.name ILIKE :producer', {
        producer: `%${query.producer}%`
      })
    }
    if (query.name) {
      command = command.andWhere('property.name ILIKE :name', {
        name: `%${query.name}%`
      })
    }
    if (query.CAR) {
      command = command.andWhere('property.CAR ILIKE :car', {
        car: `%${query.CAR}%`
      })
    }

    const res = await Promise.all([
      command.getCount(),
      command
        .skip(page * limit)
        .take(limit)
        .orderBy(`property.${column}`, direction.toUpperCase())
        .getMany()
    ])

    const [totalItems, items] = res

    const count = Number(totalItems)

    const totalPages =
      totalItems <= limit ? 1 : parseInt((count / limit).toFixed())

    const found = {
      items,
      pagination: {
        totalPages,
        totalItems: count,
        page,
        limit
      }
    }

    if (!found.items.length) throw new AppError($errors.notFound, { query })
    return found
  }

  public async findById(
    query: PropertyProducerQuery,
    { shouldThrow = true } = {}
  ) {
    const found = await this.$getRepo().findOne({
      relations: ['property', 'producer', 'property.certifications'],
      where: query
    })

    if (!found) {
      if (!shouldThrow) return null
      throw new AppError($errors.notFound, { details: { query } })
    }

    return found
  }

  public async findByPropertyId(
    query: PropertyProducerQuery,
    { shouldThrow = true } = {}
  ) {
    const found = await this.$getRepo().find({
      relations: ['property', 'producer'],
      where: query
    })

    if (!found) {
      if (!shouldThrow) return null
      throw new AppError($errors.notFound, { details: { query } })
    }

    return found
  }

  public async linkPropertyWithProducer(
    propertyId: string,
    producer: Producer
  ): Promise<Property> {
    const propertyRepo = getRepository(Property)
    const property = await propertyRepo.findOne({
      where: { id: propertyId },
      relations: ['producers']
    })
    if (!property) throw new AppError($errors.notFound)
    if (property.producers.find(({ id }) => id === producer.id)) return property
    const updated = await propertyRepo.save({
      ...property,
      producers: [...property.producers, omit(producer, 'property')]
    })
    return updated
  }

  public async upsertProducer(
    producer: Partial<Producer>,
    propertyId: string,
    blockStatus: boolean,
    reason: string,
    add: boolean
  ) {
    const producerRepo = getRepository(Producer)
    const query = { CPFCNPJ: producer.CPFCNPJ }

    if (producer.IE !== 'ISENTO') {
      Object.assign(query, { IE: producer.IE })
    }

    const found = await producerRepo.findOne({ where: query })
    if (found) {
      if (add) {
        const repoPP = getRepository(PropertyProducer)
        const foundPP = await repoPP.findOne({
          where: { propertyId, producerId: found.id }
        })
        if (foundPP) throw new AppError($errors.duplicated, { query })
      }
      await this.linkPropertyWithProducer(propertyId, found)
      await producerRepo.update(
        { id: found.id },
        omit(
          producer,
          'IE',
          'CPFCNPJ',
          'establishmentCode',
          'free',
          'blockStatus',
          'reason'
        )
      )

      await this.upsertPropertyProducer(
        propertyId,
        found.id,
        blockStatus,
        reason
      )

      return { ...found, ...producer, blockStatus, reason }
    }

    const created = producerRepo.create({ ...producer })
    await producerRepo.save(created)
    await this.linkPropertyWithProducer(propertyId, created)

    await this.upsertPropertyProducer(
      propertyId,
      created.id,
      blockStatus,
      reason
    )

    return { ...created, blockStatus, reason }
  }

  public async changeProducerLock(
    propertyId: string,
    producerId: string,
    blockStatus: boolean,
    reason: string
  ) {
    const producerRepo = getRepository(Producer)
    const query = { id: producerId }

    const found = await producerRepo.findOne({ where: query })
    if (!found) {
      throw new AppError($errors.notFound, {
        details: { query: { producerId } }
      })
    }

    await this.upsertPropertyProducer(propertyId, found.id, blockStatus, reason)

    return { ...found, blockStatus, reason }
  }

  public async upsertPropertyProducer(
    propertyId,
    producerId,
    blockStatus,
    reason
  ) {
    const repo = getRepository(PropertyProducer)
    const found = await repo.findOne({
      where: { propertyId, producerId }
    })
    if (found) {
      repo.update({ id: found.id }, { blockStatus, reason })
    } else {
      const created = repo.create({
        propertyId,
        producerId,
        blockStatus,
        reason
      })
      await repo.save(created)
    }
  }

  public async upsert(
    payload,
    user,
    propertyId,
    add = false
  ): Promise<PropertyProducer[]> {
    const producersPromise = payload.producers
      .filter((e) => e)
      .map((producer) => {
        const { blockStatus, reason } = producer
        return this.upsertProducer(
          { ...producer, authorId: user.id },
          propertyId,
          blockStatus,
          reason,
          add
        )
      })
    return await Promise.all(producersPromise)
  }

  public async updateProducerLock(
    payload,
    propertyId
  ): Promise<PropertyProducer[]> {
    const producersPromise = payload.producers
      .filter((e) => e)
      .map((producer) => {
        const { id: producerId, blockStatus, reason } = producer
        return this.changeProducerLock(
          propertyId,
          producerId,
          blockStatus,
          reason
        )
      })
    return await Promise.all(producersPromise)
  }

  // TODO fazer soft delete no producer e se for o ultimo produtor, fazer soft delete na propriedade
  public async removeOne({ id }) {
    try {
      return await this.$getRepo().softDelete({ id })
    } catch (ex) {
      throw new AppError($errors.notFound, {
        entity: 'PropertyProducer',
        query: { id }
      })
    }
  }
}

export function getRepo(): Repository {
  return new Repository()
}
