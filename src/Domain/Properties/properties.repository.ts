import { PGDB } from '@/Shared/Database/knex'
import { Accesses, AppError } from '@/Shared/Protocols'
import {
  $errors,
  getTypeORMCustomRepo,
  joinWithConditions,
  QueryUtil
} from '@/Shared/Utils'
import { getConditions } from '@/Shared/Utils/traceabilityTable/getConditions'
import { getListRowsQuery } from '@/Shared/Utils/traceabilityTable/getListRowsQuery'
import { fetchList } from '@/Shared/Utils/traceabilityTable/fetchList'
import { countList } from '@/Shared/Utils/traceabilityTable/countList'
import { FiltersPayload } from '../TraceabilityFilter/traceabilityFilter.service'
import { QUERY_COLLECTION } from './properties.query'
import { Property } from './property.entity'
import { Reference } from '@/Domain/Reference/reference.entity'
import { User } from '@/Domain/User/user.entity'
import { ACTION } from './property.enum'
import {
  EntityRepository,
  FindConditions,
  Like,
  Not,
  Repository as _Repository
} from 'typeorm'
import { omit } from 'lodash'
import { City as CityRepo } from '@/Domain/City/city.service'
import { getRepo as ReferenceRepo } from '@/Domain/Reference/reference.repository'
import { getRepo as PropertyProducerRepo } from '@/Domain/PropertyProducers/propertyProducers.repository'
import { Repository as PropertyLogRepo } from '@/Domain/PropertyLog/propertyLog.repository'
import { Repository as PropertyCertificationsRepo } from '@/Domain/PropertyCertifications/propertyCertifications.repository'

export type PropertyQuery = FiltersPayload

type PropertyQueryCUstom = FindConditions<Property> | FindConditions<Property>[]

export type PropertyPayload = Omit<Property, 'id' | 'createdAt' | 'updatedAt'>
interface PropertyRepo extends _Repository<Property> {}

const columns = {
  order: 'id',
  cargo: 'nr_carga',
  slaughterindustrycnpj: 'cnpj_industria',
  boughtat: 'dt_compra',
  slaughtedat: 'dt_abate',
  producerdoc: 'prod_cpf_cnpj',
  producerie: 'prod_nr_ie',
  producername: 'prod_nome_razaosocial',
  propname: 'faz_nome',
  propcar: 'faz_car',
  proplat: 'faz_lat',
  proplng: 'faz_lng',
  propcidade: 'faz_cidade',
  propestado: 'faz_estado'
}

const NON_EXACT_KEYS = ['name', 'CAR']

@EntityRepository(Property)
class TypeORMRepo extends _Repository<Property> implements PropertyRepo {}

export class Repository {
  private $client: PGDB

  private $getRepo: () => PropertyRepo

  private $ppRepo: typeof PropertyProducerRepo
  private $propertyCertificationsRepo: typeof PropertyCertificationsRepo
  private $propertyLogRepo: PropertyLogRepo
  private $cityRepo: CityRepo

  private $query: QueryUtil

  constructor({
    $PGDB = PGDB,
    repo = getTypeORMCustomRepo<PropertyRepo>(TypeORMRepo),
    $PropertyProducerRepo = PropertyProducerRepo,
    $PropertyCertificationsRepo = PropertyCertificationsRepo,
    $PropertyLogRepo = PropertyLogRepo,
    $CityRepo = CityRepo,
    $Query = QueryUtil
  } = {}) {
    this.$client = new $PGDB()
    this.$getRepo = repo
    this.$ppRepo = $PropertyProducerRepo
    this.$propertyCertificationsRepo = $PropertyCertificationsRepo
    this.$propertyLogRepo = new $PropertyLogRepo()
    this.$cityRepo = new $CityRepo()
    this.$query = new $Query(NON_EXACT_KEYS)
  }

  public async find(
    { limit, page, column, direction },
    filters: PropertyQuery = {},
    accesses?: Accesses
  ) {
    const params = {
      ...filters,
      limit,
      page,
      column: columns[column],
      direction
    }
    const db = this.$client.knex

    const target = 'properties'
    const conditions = joinWithConditions(
      getConditions({
        params,
        queryCollection: QUERY_COLLECTION,
        target
      }),
      QUERY_COLLECTION.properties.accessesFilter(accesses)
    )

    const listRowsQuery = getListRowsQuery({
      conditions,
      queryCollection: QUERY_COLLECTION,
      target
    })
    const countRowsQuery = getListRowsQuery({
      conditions,
      count: true,
      queryCollection: QUERY_COLLECTION,
      target
    })

    const WRAPPERS = { properties: Property }

    // if (!filters.locations) {
    const [items, totalItems] = await Promise.all([
      fetchList(db, params, listRowsQuery, WRAPPERS[target]),
      countList(db, countRowsQuery)
    ])

    const totalPages =
      totalItems <= limit ? 1 : parseInt((totalItems / limit).toFixed())

    const found = {
      charts: [],
      items,
      kpis: [],
      pagination: {
        totalPages,
        totalItems: totalItems,
        page,
        limit
      }
    }

    return found
    // } else {
    //   console.log({ listRowsQuery })
    //   const found = await fetchList(
    //     db,
    //     {
    //       ...filters,
    //       column: columns[column]
    //     },
    //     listRowsQuery,
    //     WRAPPERS[target]
    //   )

    //   return found
    // }
  }

  public async list({ limit, page, column, direction }, query = {} as any) {
    const where = this.$query.handle(
      omit(query, ['CPFCNPJ', 'producer', 'state'])
    )

    if (query.blockStatus === false) {
      where.blockStatus = query.blockStatus
    }

    let command = this.$getRepo()
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.producers', 'propertyProducer')
      .leftJoinAndSelect('propertyProducer.producer', 'producer')
      .leftJoinAndSelect('property.city', 'cities')
      .where(where)

    if (query.CPFCNPJ) {
      command = command.andWhere('producers.CPFCNPJ = :cpfcnpj', {
        cpfcnpj: query.CPFCNPJ.replace(/\D/g, '')
      })
    }
    if (query.biome) {
      command = command.andWhere('property.biome = :biome', {
        biome: query.biome
      })
    }

    if (query.state) {
      command = command.andWhere('cities.uf = :state', {
        state: query.state
      })
    }

    if (query.producer) {
      command = command.andWhere('producers.name ILIKE :producer', {
        producer: `%${query.producer}%`
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
    query: PropertyQueryCUstom,
    { shouldThrow = true } = {}
  ) {
    const found = await this.$getRepo()
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.producers', 'propertyProducer')
      .leftJoinAndSelect('propertyProducer.producer', 'producer')
      .leftJoinAndSelect('property.contacts', 'contacts')
      .leftJoinAndSelect('property.certifications', 'certifications')
      .leftJoinAndSelect('property.city', 'cities')
      .where(query)
      .getOne()

    if (!found) {
      if (!shouldThrow) return null
      throw new AppError($errors.notFound, { details: { query } })
    }

    return found
  }

  public async findByCAR(CAR: string) {
    const found = await this.$getRepo()
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.producers', 'propertyProducer')
      .leftJoinAndSelect('propertyProducer.producer', 'producer')
      .leftJoinAndSelect('property.contacts', 'contacts')
      .leftJoinAndSelect('property.certifications', 'certifications')
      .leftJoinAndSelect('property.city', 'cities')
      .where({ CAR: Like(CAR) })
      .getOne()

    if (found) return found
    throw new AppError($errors.notFound, { CAR })
  }

  public async insertOne(
    payload: PropertyPayload,
    user: User,
    action = ACTION.Insert
  ) {
    const repo = this.$getRepo()

    if (payload.CAR) {
      const { CAR } = payload
      const hasDuplicatedCAR = await repo.findOne({ CAR })
      if (hasDuplicatedCAR) throw new AppError($errors.duplicated, { CAR })
    }

    if (payload.producers.length >= 2) {
      const { producers }: any = payload
      producers.every((prod) => {
        const producer = producers.filter(
          (p) => p.CPFCNPJ === prod.CPFCNPJ && p.IE === prod.IE
        )
        if (producer.length >= 2) {
          throw new AppError($errors.duplicatedCPFCNPJIE, { producers })
        }
        return true
      })
    }

    const contacts = (payload.contacts || []).map((e) => ({
      ...e,
      authorId: user.id
    }))

    const created = repo.create({
      ...omit(payload, ['producers', 'certifications']),
      contacts,
      authorId: user.id
    })
    await repo.save(created)

    const { id } = created

    const certRepo = new this.$propertyCertificationsRepo()
    if (payload.certifications) {
      created.certifications = await certRepo.upsert(payload, user, id)
    }

    const prodRepo = this.$ppRepo()
    created.producers = await prodRepo.upsert(payload, user, id)

    const city = await this.$cityRepo.find({ id: created.cityId })

    if (!city) {
      throw new AppError($errors.notFound, {
        details: { query: { id: created.cityId } }
      })
    }

    await this.$propertyLogRepo.upsertLog(action, city, created, user)

    return created
  }

  public async addProducer(payload, user: User) {
    const repo = this.$getRepo()

    const { id } = payload

    const property = await repo.findOne({
      where: { id }
    })
    if (!property) {
      throw new AppError($errors.notFound, {
        details: { query: { id }, payload }
      })
    }

    const prodRepo = this.$ppRepo()
    property.producers = await prodRepo.upsert(payload, user, id, true)

    const city = await this.$cityRepo.find({ id: property.cityId })

    if (!city) {
      throw new AppError($errors.notFound, {
        details: { query: { id: property.cityId } }
      })
    }

    await this.$propertyLogRepo.upsertLog(ACTION.Update, city, property, user)

    return property
  }

  public async import(payload, user: User) {
    const omitFields = [
      'id',
      'nameProducer',
      'CPFCNPJ',
      'IE',
      'keyInsert',
      'nameProperty',
      'zipCode',
      'streetNumber',
      'complement',
      'cityName',
      'stateName',
      'flagStatus',
      'typeOperation',
      'log',
      'createdAt',
      'updatedAt',
      'city'
    ]
    const { propertiesTmpIds } = payload

    const referenceRepo = ReferenceRepo
    const propertiesTmp: any = await Promise.all(
      propertiesTmpIds.map((id) => {
        return referenceRepo().find({ id })
      })
    )

    const propertiesTmpPromise = propertiesTmp.map(async (each) => {
      const [propertyTmp]: Reference[] = each
      const property = {
        ...omit(propertyTmp, omitFields),
        name: propertyTmp.nameProperty,
        fancyName: propertyTmp.nameProperty,
        cep: propertyTmp.zipCode,
        address: `${propertyTmp.address} ${propertyTmp.streetNumber}`,
        producers: [
          {
            name: propertyTmp.nameProducer,
            CPFCNPJ: propertyTmp.CPFCNPJ,
            IE: propertyTmp.IE,
            blockStatus: propertyTmp.flagStatus,
            reason: ''
          }
        ]
      }

      const found = await this.$getRepo()
        .createQueryBuilder('property')
        .where({ CAR: Like(property.CAR) })
        .getOne()

      const result = !found
        ? await this.insertOne(property as any, user, ACTION.Import)
        : await this.updateOne(
            { ...property, id: found.id } as any,
            user,
            ACTION.Import
          )
      await referenceRepo().delete(propertyTmp.id)
      return result
    })

    return await Promise.all(propertiesTmpPromise)
  }

  public async changingLockAllState(payload, user: User) {
    const repo = this.$getRepo()

    const { id } = payload

    const property = await repo.findOne({
      relations: ['producers'],
      where: { id }
    })
    if (!property) {
      throw new AppError($errors.notFound, {
        details: { query: { id }, payload }
      })
    }

    const _payload = {
      producers: property.producers.map((e) => {
        return {
          id: e.producerId,
          blockStatus: payload.blockStatus,
          reason: payload.reason
        }
      })
    }

    const prodRepo = this.$ppRepo()
    property.producers = await prodRepo.updateProducerLock(_payload, id)

    const city = await this.$cityRepo.find({ id: property.cityId })

    if (!city) {
      throw new AppError($errors.notFound, {
        details: { query: { id: property.cityId } }
      })
    }

    await this.$propertyLogRepo.upsertLog(ACTION.Update, city, property, user)

    return property
  }

  public async changingLockState(payload, user: User) {
    const repo = this.$getRepo()

    const { id } = payload

    const property = await repo.findOne({
      where: { id }
    })
    if (!property) {
      throw new AppError($errors.notFound, {
        details: { query: { id }, payload }
      })
    }

    const prodRepo = this.$ppRepo()
    property.producers = await prodRepo.updateProducerLock(payload, id)

    const city = await this.$cityRepo.find({ id: property.cityId })

    if (!city) {
      throw new AppError($errors.notFound, {
        details: { query: { id: property.cityId } }
      })
    }

    await this.$propertyLogRepo.upsertLog(ACTION.Update, city, property, user)

    return property
  }

  public async updateOne(payload, user: User, action = ACTION.Update) {
    const repo = this.$getRepo()
    const certRepo = new this.$propertyCertificationsRepo()

    const { id } = payload

    const property = await repo.findOne({
      where: { id }
    })
    if (!property) {
      throw new AppError($errors.notFound, {
        details: { query: { id }, payload }
      })
    }

    if (payload.CAR) {
      const { CAR } = payload
      const hasDuplicatedCAR = await repo.findOne({
        where: { CAR, id: Not(id) }
      })
      if (hasDuplicatedCAR) throw new AppError($errors.duplicated, { CAR })
    }

    const contacts = (payload.contacts || []).map((e) => ({
      ...e,
      authorId: user.id
    }))

    const certifications = (payload.certifications || []).map((e) => ({
      ...e,
      propertyId: property.id
    }))

    if (payload.certifications) {
      if (property.certifications) {
        property.certifications.map((certification) => {
          const hasCertification = payload.certifications.find(
            (c) => c.id === certification.id
          )
          if (hasCertification === undefined) {
            certifications.push({
              ...certification
            })
          }
        })
      }
      await certRepo.upsert(payload, user, id)
    }

    const updated: Property = await repo.save({
      ...omit(payload, ['producers', 'certifications']),
      contacts,
      id
    })
    await repo.save(updated)

    const prodRepo = this.$ppRepo()
    updated.producers = await prodRepo.upsert(payload, user, id)

    const city = await this.$cityRepo.find({ id: updated.cityId })

    if (!city) {
      throw new AppError($errors.notFound, {
        details: { query: { id: property.cityId } }
      })
    }

    await this.$propertyLogRepo.upsertLog(action, city, updated, user)

    return updated
  }

  public async removeOne({ id }) {
    try {
      return await this.$getRepo().softDelete({ id })
    } catch (ex) {
      throw new AppError($errors.notFound, {
        entity: 'Property',
        query: { id }
      })
    }
  }
}
