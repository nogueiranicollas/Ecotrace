import { Request } from 'express'
import { getRepository, Like } from 'typeorm'

import { AppError, Req } from '@/Shared/Protocols'
import { $errors } from '@/Shared/Utils'

import { City as CityRepo } from '@/Domain/City/city.service'
import { Repository as PropertyRepo } from '@/Domain/Properties/properties.repository'

import { Reference as Entity } from './reference.entity'
import { Validator } from './reference.validator'

export class Reference {
  private __getRepository: typeof getRepository
  private __Model: typeof Entity
  private $validator: typeof Validator
  private $cityRepo: CityRepo
  private $propertyRepo: PropertyRepo

  constructor({
    $GetRepository = getRepository,
    $Entity = Entity,
    $Validator = Validator,
    $CityRepo = CityRepo,
    $PropertyRepo = PropertyRepo
  } = {}) {
    this.__getRepository = $GetRepository
    this.__Model = $Entity
    this.$validator = $Validator
    this.$cityRepo = new $CityRepo()
    this.$propertyRepo = new $PropertyRepo()
  }

  private getRepo() {
    return this.__getRepository(this.__Model)
  }

  public async find(req: Request) {
    const limit = 10
    const page = 0
    const column = 'updated_at'
    const direction = 'DESC'

    const { payload, validationErrors } = await this.$validator.validateQuery(
      req
    )
    if (!payload) throw validationErrors

    const command = this.getRepo().createQueryBuilder('reference')

    const res = await Promise.all([
      command.getCount(),
      command
        .skip(page * limit)
        .take(limit)
        .orderBy(column, direction)
        .getMany()
    ])

    const [totalItems, items] = res

    const promisseProperties = items.map(async (each: any) => {
      try {
        const found = await this.$propertyRepo.findByCAR(each.CAR)
        const producer = found.producers.find(
          (f) =>
            f.producer.CPFCNPJ === each.CPFCNPJ && f.producer.IE === each.IE
        )
        if (!producer) {
          each.property = null
          return
        }
        const property = {
          nameProperty: found.name,
          description: found.description,
          CAR: found.CAR,
          establishmentCode: found.establishmentCode,
          INCRA: found.INCRA,
          NIRF: found.NIRF,
          CCIR: found.CCIR,
          LARLAU: found.LARLAU,
          perimeterDocsOrigin: found.perimeterDocsOrigin,
          lat: found.lat,
          lng: found.lng,
          area: found.area,
          zipCode: found.cep,
          address: found.address,
          cityName: found.city.name,
          stateName: found.city.uf,

          nameProducer: producer.producer.name,
          CPFCNPJ: producer.producer.CPFCNPJ,
          IE: producer.producer.IE,
          livestockExploitationCode:
            producer.producer.livestockExploitationCode || '',
          flagStatus: producer.blockStatus ? 'Bloqueada' : 'Liberada'
        }
        each.property = property
      } catch (error) {
        each.property = null
      }
    })
    await Promise.all(promisseProperties)

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

    if (!found.items.length) throw new AppError($errors.notFound)
    return found
  }

  public async findById(req: Request): Promise<Entity> {
    const { payload, validationErrors } = await this.$validator.validateParams(
      req
    )
    if (!payload) throw validationErrors

    const { id } = req.params
    const query = { id }

    const repo = this.getRepo()
    const found = await repo.findOne(query)
    if (!found) {
      Object.assign(req, { error: { query } })
      throw new AppError($errors.notFound)
    }

    return found
  }

  public async findByCPFCNPJ(req: Request): Promise<Entity> {
    const { payload, validationErrors } = await this.$validator.validateParams(
      req
    )
    if (!payload) throw validationErrors

    const { CPFCNPJ } = req.params
    const query = { CPFCNPJ }

    const repo = this.getRepo()
    const found = await repo.findOne({
      where: { CPFCNPJ: Like(CPFCNPJ) }
    })

    if (!found) {
      Object.assign(req, { error: { query } })
      throw new AppError($errors.notFound)
    }

    return found
  }

  public async insertOne(req: Req): Promise<Entity> {
    const { payload, validationErrors } = await this.$validator.validateBody(
      req
    )
    if (!payload) throw validationErrors
    const { body } = req

    const repo = this.getRepo()
    if (body.CAR && body.CAR !== 'ISENTO') {
      const hasDuplicatedCAR = await repo.findOne({ CAR: body.CAR })
      if (hasDuplicatedCAR) {
        throw new AppError($errors.duplicated)
      }
    }

    const cityRepo = this.$cityRepo
    const query = {
      name: body.cityName,
      uf: body.stateName
    }
    const city = await cityRepo.find(query)
    if (!city) throw new AppError($errors.notFound, { details: { query } })

    const created = repo.create({
      ...body,
      cityId: city[0].id
    } as Entity)

    return await repo.save(created)
  }

  public async removeOne(req: Request): Promise<string> {
    const { payload, validationErrors } = await this.$validator.validateParams(
      req
    )
    if (!payload) throw validationErrors

    const { id } = req.params

    const repo = this.getRepo()
    await repo.delete({ id })

    return id
  }
}
